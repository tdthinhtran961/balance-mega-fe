import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const Component = ({ idRequest, Get, onClick, formatData }) => {
  const localizer = momentLocalizer(moment);
  const { t } = useTranslation();

  const [events, setEvents] = useState([
    {
      id: 0,
      title: 'All Day Event very long title',
      allDay: true,
      start: new Date(),
      end: new Date(),
    },
  ]);
  const handleChangeDate = useCallback(
    async (date) => {
      if (Get) {
        const { data } = await Get(moment(date).format('YYYY-MM'), idRequest);
        formatData && setEvents(formatData(data));
      }
    },
    [Get, idRequest, formatData],
  );

  useEffect(() => {
    handleChangeDate(new Date());
  }, [handleChangeDate]);

  // noinspection JSUnusedGlobalSymbols
  return (
    <Calendar
      selectable
      localizer={localizer}
      events={events}
      defaultView={Views.MONTH}
      defaultDate={new Date()}
      style={{ height: '80vh' }}
      views={{ month: true }}
      onSelectEvent={onClick}
      onNavigate={async (date) => await handleChangeDate(date)}
      popup={true}
      messages={{
        showMore: (total) => '+' + total + ' ' + t('components.calendar.more'),
      }}
    />
  );
};
export default Component;
