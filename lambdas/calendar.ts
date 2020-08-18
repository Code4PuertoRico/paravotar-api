import { promisify } from 'util';

import _ from "lodash";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop";
import httpErrorHandler from "@middy/http-error-handler";
import { createEvents as icsCreateEvents, EventAttributes, DateArray } from 'ics';

const createICS = promisify(icsCreateEvents);

const dateToArray = (date: Date, includeTime: boolean = false): DateArray => {
  const d: number[] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  const t: number[] = [date.getHours(), date.getMinutes()];

  return <DateArray>(includeTime ? d.concat(t) : d);
};

function processEvent (event: any): EventAttributes {
  return <EventAttributes>{
    title: event.title,
    description: event.description,
    start: dateToArray(new Date(event.start)),
    end: dateToArray(new Date(event.end || event.start)),
    productId: 'code4puertorico/paravotar',
  };
}

const handler = async (event: any) => {
  const body = JSON.parse(event.body);
  const events = _.get(body, 'events', []);

  const ics = await createICS(events.map(processEvent));

  try {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': 'attachment; filename=paravotar.ics'
      },
      body: ics
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};

export const createEvent = middy(handler)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
