'use client';
import React from 'react';
import EventDetail from '../../../../components/EventDetail';

const EventDetailPage: React.FC = ({ params }: { params: { id: string } }) => {
const { id } = params
    if (!id) {
        return <div>Loading...</div>;
    }

    return <EventDetail eventId={id as string} />;
};

export default EventDetailPage;


