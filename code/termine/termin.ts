import { z } from "zod/v4";
import { anfrageSchema } from "./anfrage";

// Terminbuchung über die eigene Kalender-Ansicht. Die Buchung legt unser Server bei Calendly an.
export const TERMIN_FEHLER = {
  start: "Bitte wählen Sie einen freien Termin.",
  telefonPflicht: "Bitte geben Sie eine Telefonnummer an, unter der wir Sie zum Termin anrufen können.",
} as const;

export const TERMIN_SEND_ERROR = "Der Termin konnte gerade nicht gebucht werden. Bitte versuchen Sie es erneut oder schreiben Sie uns über „Nachricht senden“.";
export const TERMIN_VERGEBEN = "Dieser Termin wurde gerade vergeben. Bitte wählen Sie eine andere Uhrzeit.";
export const TERMIN_NICHT_VERFUEGBAR = "Die Online-Terminbuchung ist gerade nicht erreichbar. Schreiben Sie uns über „Nachricht senden“ oder rufen Sie uns an.";

const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?Z$/;

export const terminSchema = anfrageSchema
  .pick({ name: true, unternehmen: true, email: true, telefon: true, nachricht: true, website: true, angezeigtAm: true })
  .extend({
    start: z.string({ error: TERMIN_FEHLER.start }).regex(ISO_UTC, TERMIN_FEHLER.start).refine((value) => Date.parse(value) > Date.now(), TERMIN_FEHLER.start),
    zeitzone: z.string().trim().max(64).regex(/^[A-Za-z0-9_+\-/]+$/).optional(),
  })
  .strict();

export type TerminFormInput = z.infer<typeof terminSchema>;

/** Antwort von GET /api/termine/status */
export type TerminStatus =
  | { aktiv: false }
  | { aktiv: true; name: string; dauer: number; ort: string | null; telefonPflicht: boolean; buchungsLink: string | null };

/** Antwort von GET /api/termine/frei */
export type TerminFrei = { von: string; bis: string; slots: string[] };

/** Antwort von POST /api/termine bei Erfolg */
export type TerminGebucht = { gebucht: true; start: string; verschiebenUrl: string | null; absagenUrl: string | null };
