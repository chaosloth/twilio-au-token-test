// const TokenValidator = require("twilio-flex-token-validator").functionValidator;

import { validator } from "twilio-flex-token-validator";

// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";

type MyContext = {
  US_ACCOUNT_SID: string;
  US_AUTH_TOKEN: string;
};

type MyEvent = {
  token?: string;
};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> =
  function (
    context: Context<MyContext>,
    event: MyEvent,
    callback: ServerlessCallback
  ) {
    console.log("Token validator", validator);

    const response = new Twilio.Response();

    if (!event.token) {
      response.setBody({ error: "missing token" });
      callback(null, response);
    }

    console.log("Validating token", event.token);

    validator(
      event.token || "invalid",
      context.US_ACCOUNT_SID,
      context.US_AUTH_TOKEN
    )
      .then((tokenResult) => {
        // validated
        response.setBody(tokenResult);
        callback(null, response);
      })
      .catch((err: any) => {
        // validation failed
        response.setBody({ error: err });
        callback(null, response);
      });
  };
