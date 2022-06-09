/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

import books from './books.json';
import popups from './popups.json';

console.log("Script started successfully");

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);

    // Clock popup
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes();
    popupOperations("clockZone", "clockPopup", "It's " + time)

    // Books categories popups
    for (let i = 0; i < popups.length; i += 3) {
        let array = popups.slice(i, i+3);

        popupOperations(array[0], array[1], array[2]);
    }

    // Books websites opener
    openWebsites(books);

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

function popupOperations(
  zoneName: string,
  popupName: string,
  popupMessage: string
) {
  let popupObject: any = undefined;

  WA.room.onEnterLayer(zoneName).subscribe(() => {
    popupObject = WA.ui.openPopup(popupName, popupMessage, []);
  });

  // Popup closing
  WA.room.onLeaveLayer(zoneName).subscribe(() => {
      if (popupObject !== undefined) {
        popupObject.close();
        popupObject = undefined;
      }
  });
}

function openWebsites(books: any) {
    Object.entries(books).forEach(([zoneName, link]) =>
        WA.room.setProperty(zoneName, "openWebsite", link as string)
    );
}

export {};
