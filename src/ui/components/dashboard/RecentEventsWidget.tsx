import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Divider } from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';

interface Event {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

interface RecentEventsWidgetProps {
  events: Event[];
}

const RecentEventsWidget: React.FC<RecentEventsWidgetProps> = ({ events }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Événements Récents
      </Typography>
      <List>
        {events.map((event, index) => (
          <React.Fragment key={event.id}>
            <ListItem>
              <ListItemIcon>
                <EventIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={event.message}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {event.type}
                    </Typography>
                    {" — "}
                    {new Date(event.timestamp).toLocaleString()}
                  </>
                }
              />
            </ListItem>
            {index < events.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default RecentEventsWidget; 