import { NextFunction, Request, Response } from "express";
import { randomUUID as uuid } from "crypto";
import { IEntry, startFactory } from "./factory";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

const PORT = 3000;

type IClient = { id: string; response: Response };

let clients: IClient[] = [];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Events service listening at http://localhost:${PORT}`);
});

const factory = startFactory();

const eventsHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  /**
   * Server-sent-events header
   */
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  };
  response.writeHead(200, headers);

  /**
   * Dump all the factory data to the newly connected clients
   */
  const data = `data: ${JSON.stringify({
    type: "POPULATE_EXISTING_ITEMS",
    items: factory.getItems(),
  })}\n\n`;

  response.write(data);

  const clientId = uuid();

  const newClient = {
    id: clientId,
    response,
  };

  clients = [...clients, newClient];

  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
};

app.get("/listener", eventsHandler);

const broadCastItemToAllClients = (item: IEntry): void =>
  void clients.forEach(
    (client) =>
      void client.response.write(
        `data: ${JSON.stringify({ item, type: "NEW_OR_CHANGED_ITEM" })}\n\n`
      )
  );

const twoSeconds = 2000;

setInterval(
  () => broadCastItemToAllClients(factory.produceOrChangeItem()),
  twoSeconds
);
