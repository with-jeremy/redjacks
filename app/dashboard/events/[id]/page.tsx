'use client';

import React from 'react';
import EventDetail from '../../../../components/EventDetail';
import { useParams } from 'next/navigation'






export default function EventDetailPage() {
  
    const params = useParams<{ id: string }>()




    const { id } = params;
    
   

    console.log(`Rendering EventDetail with event.id: ${id}`);

    return (
        <div>
            <EventDetail eventId={id} />
        </div>
    );
};

