'use client';

import React from 'react';
import EventDetail from '../../../../components/EventDetail';







export default function EventDetailPage({ params }: { params: { id: string } }) {
  
   



    const { id }: { id: { id: string } } = React.use(params);
    
   

    console.log(`Rendering EventDetail with event.id: ${id}`);

    return (
        <div>
            <EventDetail eventId={id} />
        </div>
    );
};

