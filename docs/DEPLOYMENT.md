# Guide de Déploiement ICARUS

## Introduction

Ce document détaille les différentes méthodes de déploiement de la plateforme ICARUS dans divers environnements. Il couvre les déploiements on-premise, cloud, hybrides et conteneurisés, ainsi que les meilleures pratiques pour chaque scénario.

## Table des matières

1. [Prérequis généraux](#prérequis-généraux)
2. [Déploiement on-premise](#déploiement-on-premise)
3. [Déploiement cloud](#déploiement-cloud)
4. [Déploiement hybride](#déploiement-hybride)
5. [Déploiement conteneurisé](#déploiement-conteneurisé)
6. [Haute disponibilité](#haute-disponibilité)
7. [Optimisation des performances](#optimisation-des-performances)
8. [Sécurisation du déploiement](#sécurisation-du-déploiement)
9. [Mise à jour et maintenance](#mise-à-jour-et-maintenance)
10. [Surveillance et alertes](#surveillance-et-alertes)

## Prérequis généraux

Avant de déployer ICARUS, assurez-vous que votre environnement répond aux exigences suivantes :

### Exigences matérielles minimales

- **Serveur principal** :
  - CPU : 8 cœurs, 3.0 GHz ou supérieur
  - RAM : 16 Go (32 Go recommandé)
  - Stockage : 100 Go SSD
  - Réseau : Interface 1 Gbps

### Exigences logicielles

- **Système d'exploitation** : Ubuntu 20.04 LTS ou supérieur, CentOS 8 ou supérieur
- **Dépendances** :
  - Docker 20.10 ou supérieur
  - Docker Compose 2.0 ou supérieur (pour déploiement conteneurisé)
  - Kubernetes 1.22 ou supérieur (pour déploiement orchestré)
  - Python 3.9 ou supérieur
  - Node.js 16 ou supérieur

### Prérequis réseau

- Ports entrants ouverts : 8443 (UI), 8080 (API), 9000 (Collecteur)
- Accès sortant vers les services de mise à jour ICARUS
- Latence réseau inférieure à 100ms entre les composants distribués

## Déploiement on-premise

Le déploiement on-premise est recommandé pour les environnements nécessitant un contrôle total sur l'infrastructure et les données.

### Installation standard

1. Téléchargez l'installateur ICARUS :
   ```bash
   wget https://download.icarus-security.com/latest/icarus-installer.sh
   chmod +x icarus-installer.sh
   ```

2. Exécutez l'installateur en mode interactif :
   ```bash
   sudo ./icarus-installer.sh --interactive
   ```

3. Suivez les instructions à l'écran pour configurer :
   - Répertoire d'installation
   - Ports d'écoute
   - Certificats SSL/TLS
   - Comptes administrateurs initiaux

4. Vérifiez l'installation :
   ```bash
   icarus-cli status --all
   ```

### Installation silencieuse

Pour les déploiements automatisés, utilisez le mode silencieux avec un fichier de configuration :

1. Créez un fichier de configuration :
   ```bash
   cp /opt/icarus/config/templates/silent-install.conf /path/to/my-config.conf
   # Éditez my-config.conf selon vos besoins
   ```

2. Exécutez l'installateur en mode silencieux :
   ```bash
   sudo ./icarus-installer.sh --silent --config=/path/to/my-config.conf
   ```

### Configuration multi-serveurs

Pour les déploiements à grande échelle, répartissez les composants sur plusieurs serveurs :

1. Serveur principal (Core + UI) :
   ```bash
   sudo ./icarus-installer.sh --component=core,ui
   ```

2. Serveurs d'analyse (NeuralNet + QuantumVault) :
   ```bash
   sudo ./icarus-installer.sh --component=neural,quantum --core-address=<adresse-serveur-principal>
   ```

3. Serveurs de collecte (Collecteurs distribués) :
   ```bash
   sudo ./icarus-installer.sh --component=collector --core-address=<adresse-serveur-principal>
   ```

## Déploiement cloud

ICARUS peut être déployé sur les principales plateformes cloud avec des optimisations spécifiques.

### AWS

1. Lancez l'AMI ICARUS depuis AWS Marketplace ou utilisez CloudFormation :
   ```bash
   aws cloudformation create-stack --stack-name icarus-deployment \
     --template-url https://icarus-templates.s3.amazonaws.com/icarus-aws-cf.yaml \
     --parameters ParameterKey=InstanceType,ParameterValue=m5.2xlarge
   ```

2. Configuration spécifique AWS :
   - Activez l'intégration avec AWS Security Hub
   - Configurez les groupes de sécurité pour les ports requis
   - Utilisez des instances EC2 avec support d'accélération matérielle pour le NeuralNet Engine

### Azure

1. Déployez ICARUS depuis Azure Marketplace ou utilisez ARM templates :
   ```bash
   az deployment group create --resource-group icarus-rg \
     --template-uri https://icarus-templates.blob.core.windows.net/templates/icarus-azure-arm.json
   ```

2. Configuration spécifique Azure :
   - Activez l'intégration avec Azure Security Center
   - Utilisez des VM série N pour l'accélération GPU du NeuralNet Engine
   - Configurez Azure Application Gateway pour la terminaison SSL

### Google Cloud Platform

1. Déployez ICARUS depuis Google Cloud Marketplace ou utilisez Deployment Manager :
   ```bash
   gcloud deployment-manager deployments create icarus-deployment \
     --template https://storage.googleapis.com/icarus-templates/icarus-gcp-dm.yaml
   ```

2. Configuration spécifique GCP :
   - Activez l'intégration avec Security Command Center
   - Utilisez des VM avec GPUs pour l'accélération du NeuralNet Engine
   - Configurez Cloud Armor pour la protection DDoS

## Déploiement hybride

Le déploiement hybride combine des composants on-premise et cloud pour une flexibilité maximale.

### Architecture recommandée

1. **On-premise** :
   - Core ICARUS
   - QuantumVault (pour la protection des données sensibles)
   - Collecteurs réseau primaires

2. **Cloud** :
   - NeuralNet Engine (pour bénéficier de l'élasticité)
   - WarpShield (environnements leurres)
   - Collecteurs réseau secondaires
   - Stockage des logs à long terme

### Configuration de la connectivité sécurisée

1. Établissez des tunnels VPN entre les environnements on-premise et cloud :
   ```bash
   icarus-cli network setup-vpn --local=on-premise --remote=cloud --encryption=aes256
   ```

2. Configurez la réplication des données :
   ```bash
   icarus-cli data setup-replication --source=on-premise --target=cloud --mode=incremental
   ```

3. Mettez en place l'équilibrage de charge global :
   ```bash
   icarus-cli network setup-global-lb --components=neural,warp
   ```

## Déploiement conteneurisé

Le déploiement conteneurisé offre portabilité et isolation pour les composants ICARUS.

### Docker Compose

1. Clonez le dépôt ICARUS :
   ```bash
   git clone https://github.com/servais1983/project-icarus.git
   cd project-icarus
   ```

2. Personnalisez le fichier d'environnement :
   ```bash
   cp .env.example .env
   # Éditez .env selon vos besoins
   ```

3. Lancez les conteneurs avec Docker Compose :
   ```bash
   docker-compose up -d
   ```

4. Vérifiez le déploiement :
   ```bash
   docker-compose ps
   ```

### Kubernetes

1. Personnalisez les manifestes Kubernetes :
   ```bash
   cd kubernetes/
   # Éditez les fichiers yaml selon vos besoins
   ```

2. Déployez avec kubectl :
   ```bash
   kubectl apply -f kubernetes/namespace.yaml
   kubectl apply -f kubernetes/secrets.yaml
   kubectl apply -f kubernetes/configmaps.yaml
   kubectl apply -f kubernetes/storage.yaml
   kubectl apply -f kubernetes/deployments/
   kubectl apply -f kubernetes/services/
   ```

3. Vérifiez le déploiement :
   ```bash
   kubectl get pods -n icarus
   ```

### Helm Chart

Pour un déploiement Kubernetes simplifié, utilisez le Helm Chart ICARUS :

1. Ajoutez le dépôt Helm ICARUS :
   ```bash
   helm repo add icarus https://helm.icarus-security.com
   helm repo update
   ```

2. Installez le chart avec des valeurs personnalisées :
   ```bash
   helm install icarus icarus/icarus-platform -f my-values.yaml
   ```

## Haute disponibilité

Pour les environnements critiques, configurez ICARUS en mode haute disponibilité.

### Architecture multi-zones

1. Déployez ICARUS dans au moins trois zones de disponibilité :
   ```bash
   icarus-cli ha setup --zones=3 --replication=sync
   ```

2. Configurez la réplication synchrone pour les données critiques :
   ```bash
   icarus-cli ha config-replication --component=quantum --mode=sync
   ```

3. Mettez en place l'équilibrage de charge avec health checks :
   ```bash
   icarus-cli ha setup-lb --check-interval=5s --timeout=3s --unhealthy-threshold=2
   ```

### Failover automatique

1. Configurez le failover automatique :
   ```bash
   icarus-cli ha setup-failover --auto --max-downtime=10s
   ```

2. Testez le failover :
   ```bash
   icarus-cli ha test-failover --component=core
   ```

## Optimisation des performances

Optimisez les performances d'ICARUS selon votre environnement spécifique.

### Optimisation du NeuralNet Engine

1. Activez l'accélération matérielle :
   ```bash
   icarus-cli optimize neural --hardware-accel=gpu --device=cuda
   ```

2. Ajustez les paramètres de mémoire :
   ```bash
   icarus-cli optimize neural --memory-limit=16G --batch-size=64
   ```

### Optimisation de la base de données

1. Configurez le cache de la base de données :
   ```bash
   icarus-cli optimize db --cache-size=4G --index-memory=2G
   ```

2. Planifiez la maintenance automatique :
   ```bash
   icarus-cli optimize db --auto-vacuum=daily --analyze=weekly
   ```

### Optimisation réseau

1. Activez la compression des données :
   ```bash
   icarus-cli optimize network --compression=zstd --level=3
   ```

2. Configurez la mise en cache des requêtes :
   ```bash
   icarus-cli optimize network --cache-ttl=300 --max-cache-size=2G
   ```

## Sécurisation du déploiement

Sécurisez votre déploiement ICARUS avec ces mesures essentielles.

### Durcissement du système

1. Appliquez les profils de sécurité recommandés :
   ```bash
   icarus-cli security harden --profile=production
   ```

2. Configurez les restrictions d'accès réseau :
   ```bash
   icarus-cli security network --restrict-admin=10.0.0.0/8 --api-whitelist=192.168.1.0/24
   ```

### Gestion des certificats

1. Configurez des certificats SSL/TLS robustes :
   ```bash
   icarus-cli security setup-certs --key-type=ecdsa --curve=p384 --days=365
   ```

2. Mettez en place la rotation automatique des certificats :
   ```bash
   icarus-cli security auto-rotate-certs --interval=90d
   ```

### Audit et journalisation

1. Activez la journalisation avancée :
   ```bash
   icarus-cli security audit --level=detailed --retention=180d
   ```

2. Configurez l'exportation des logs vers un SIEM externe :
   ```bash
   icarus-cli security export-logs --target=splunk --format=cef --encryption=tls1.3
   ```

## Mise à jour et maintenance

Maintenez votre déploiement ICARUS à jour et en bon état de fonctionnement.

### Mises à jour automatiques

1. Configurez les mises à jour automatiques :
   ```bash
   icarus-cli maintenance auto-update --schedule="0 2 * * 0" --components=all
   ```

2. Définissez la politique de mise à jour :
   ```bash
   icarus-cli maintenance update-policy --security=immediate --features=scheduled
   ```

### Sauvegardes

1. Configurez les sauvegardes automatiques :
   ```bash
   icarus-cli maintenance backup --schedule="0 1 * * *" --retention=30d
   ```

2. Testez la restauration régulièrement :
   ```bash
   icarus-cli maintenance test-restore --latest --target=test-env
   ```

## Surveillance et alertes

Mettez en place une surveillance proactive de votre déploiement ICARUS.

### Surveillance interne

1. Configurez les tableaux de bord de surveillance :
   ```bash
   icarus-cli monitoring setup-dashboards --preset=operations
   ```

2. Définissez les seuils d'alerte :
   ```bash
   icarus-cli monitoring set-thresholds --cpu=80 --memory=85 --disk=90 --queue-lag=60s
   ```

### Intégration avec des systèmes externes

1. Configurez l'intégration avec Prometheus :
   ```bash
   icarus-cli monitoring integrate --system=prometheus --endpoint=http://prometheus:9090
   ```

2. Mettez en place les notifications :
   ```bash
   icarus-cli monitoring notifications --email="ops@example.com" --slack="#icarus-alerts" --pagerduty
   ```

---

## Annexes

### A. Exemples de fichiers de configuration

#### A.1. Exemple de fichier Docker Compose

```yaml
version: '3.8'

services:
  icarus-core:
    image: icarus/core:latest
    ports:
      - "8080:8080"
    volumes:
      - icarus-data:/var/lib/icarus
    environment:
      - ICARUS_ENV=production
      - ICARUS_LOG_LEVEL=info
    restart: unless-stopped
    depends_on:
      - icarus-db
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 8G

  icarus-ui:
    image: icarus/ui:latest
    ports:
      - "8443:8443"
    environment:
      - ICARUS_CORE_URL=http://icarus-core:8080
    restart: unless-stopped
    depends_on:
      - icarus-core

  icarus-neural:
    image: icarus/neural:latest
    volumes:
      - icarus-models:/var/lib/icarus/models
    environment:
      - ICARUS_CORE_URL=http://icarus-core:8080
      - CUDA_VISIBLE_DEVICES=0
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '8'
          memory: 16G

  icarus-db:
    image: postgres:14
    volumes:
      - icarus-db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=icarus
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
      - POSTGRES_DB=icarus
    secrets:
      - db_password
    restart: unless-stopped

volumes:
  icarus-data:
  icarus-models:
  icarus-db-data:

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

#### A.2. Exemple de valeurs Helm

```yaml
# values.yaml
global:
  environment: production
  logLevel: info
  storageClass: managed-premium

core:
  replicas: 3
  resources:
    requests:
      cpu: 2
      memory: 4Gi
    limits:
      cpu: 4
      memory: 8Gi
  persistence:
    size: 100Gi

ui:
  replicas: 2
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.class: nginx
      cert-manager.io/cluster-issuer: letsencrypt-prod
    hosts:
      - host: icarus.example.com
        paths:
          - path: /
            pathType: Prefix
    tls:
      - secretName: icarus-tls
        hosts:
          - icarus.example.com

neural:
  replicas: 2
  gpuEnabled: true
  resources:
    requests:
      cpu: 4
      memory: 8Gi
    limits:
      cpu: 8
      memory: 16Gi
      nvidia.com/gpu: 1
  persistence:
    size: 200Gi

database:
  internal: true
  persistence:
    size: 50Gi
  resources:
    requests:
      cpu: 2
      memory: 4Gi
    limits:
      cpu: 4
      memory: 8Gi
```

### B. Scripts d'automatisation

#### B.1. Script de déploiement automatisé

```bash
#!/bin/bash
# deploy-icarus.sh - Script de déploiement automatisé d'ICARUS

# Configuration
ICARUS_VERSION="1.2.0"
DEPLOY_ENV="production"
INSTALL_DIR="/opt/icarus"
CONFIG_FILE="./icarus-config.yaml"

# Vérification des prérequis
echo "Vérification des prérequis..."
command -v docker >/dev/null 2>&1 || { echo "Docker est requis mais non installé. Abandon."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose est requis mais non installé. Abandon."; exit 1; }

# Création des répertoires
echo "Création des répertoires..."
mkdir -p ${INSTALL_DIR}/{config,data,logs,certs}

# Téléchargement des images
echo "Téléchargement des images ICARUS ${ICARUS_VERSION}..."
docker pull icarus/core:${ICARUS_VERSION}
docker pull icarus/ui:${ICARUS_VERSION}
docker pull icarus/neural:${ICARUS_VERSION}
docker pull icarus/quantum:${ICARUS_VERSION}
docker pull icarus/aegis:${ICARUS_VERSION}

# Génération des certificats
echo "Génération des certificats..."
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ${INSTALL_DIR}/certs/icarus.key \
  -out ${INSTALL_DIR}/certs/icarus.crt \
  -subj "/CN=icarus.local/O=ICARUS Security/C=FR"

# Copie des fichiers de configuration
echo "Configuration d'ICARUS..."
cp ${CONFIG_FILE} ${INSTALL_DIR}/config/icarus.yaml
cp docker-compose.yaml ${INSTALL_DIR}/

# Démarrage des services
echo "Démarrage des services ICARUS..."
cd ${INSTALL_DIR}
docker-compose up -d

# Vérification du déploiement
echo "Vérification du déploiement..."
sleep 30
if docker-compose ps | grep -q "Up"; then
  echo "Déploiement ICARUS réussi!"
  echo "Interface accessible à https://localhost:8443"
else
  echo "Erreur lors du déploiement. Vérifiez les logs."
  docker-compose logs
  exit 1
fi
```

#### B.2. Script de sauvegarde

```bash
#!/bin/bash
# backup-icarus.sh - Script de sauvegarde automatisée d'ICARUS

# Configuration
BACKUP_DIR="/backup/icarus"
ICARUS_DIR="/opt/icarus"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/icarus-backup-${DATE}.tar.gz"

# Création du répertoire de sauvegarde
mkdir -p ${BACKUP_DIR}

# Arrêt gracieux des services
echo "Arrêt des services ICARUS..."
cd ${ICARUS_DIR}
docker-compose stop

# Sauvegarde des données
echo "Sauvegarde des données..."
tar -czf ${BACKUP_FILE} -C ${ICARUS_DIR} data config certs

# Redémarrage des services
echo "Redémarrage des services ICARUS..."
docker-compose start

# Nettoyage des anciennes sauvegardes
echo "Nettoyage des anciennes sauvegardes..."
find ${BACKUP_DIR} -name "icarus-backup-*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete

echo "Sauvegarde terminée: ${BACKUP_FILE}"
```

---

© 2025 Projet ICARUS - Tous droits réservés
