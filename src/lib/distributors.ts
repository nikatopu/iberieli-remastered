import { sql, eq, asc } from "drizzle-orm";
import { db } from "./db";
import { distributors } from "./schema";
import { countryName } from "@/data/countries";

export { normaliseUrl, displayHost } from "./urls";

export interface DistributorEntry {
  id: number;
  countryCode: string;
  countryName: string;
  url: string;
  name: string | null;
  visible: boolean;
}

/**
 * The distributors Iberieli shipped with before the admin panel existed. Seeded
 * once, on the first read of an empty table — after that the admin panel owns
 * this list entirely.
 */
const DEFAULT_DISTRIBUTORS: {
  countryCode: string;
  name: string;
  url: string;
}[] = [
  {
    countryCode: "DE",
    name: "Naturwein Georgien",
    url: "https://www.naturwein-georgien.de/",
  },
  {
    countryCode: "GB",
    name: "Les Caves de Pyrene",
    url: "https://www.lescaves.co.uk/lescaves-welcome",
  },
  {
    countryCode: "FR",
    name: "Clos du Tue-Boeuf",
    url: "https://www.facebook.com/closdutueboeuf",
  },
  { countryCode: "US", name: "Ghvinos Wines", url: "https://ghvinos.com/" },
  { countryCode: "JP", name: "Racines", url: "https://racines.co.jp/" },
  { countryCode: "BE", name: "Alevino", url: "https://www.alevino.be/home" },
  { countryCode: "DK", name: "Bichel Vine", url: "https://bichel.dk/" },
  {
    countryCode: "IT",
    name: "Velier",
    url: "https://www.velier.it/en/liqueurs/1708-our-wine.html",
  },
  {
    countryCode: "AU",
    name: "Goodstock Wine",
    url: "https://www.goodstockwine.com/",
  },
  {
    countryCode: "GE",
    name: "Topuridze Winery",
    url: "https://topuridzewinery.ge/",
  },
];

let bootstrapped = false;

/**
 * The project has no migration runner — tables are pushed by hand with
 * drizzle-kit. This keeps the distributors table self-installing so a deploy
 * never 500s on a missing relation.
 */
async function ensureTable() {
  if (bootstrapped) return;
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS distributors (
      id serial PRIMARY KEY,
      country_code text NOT NULL UNIQUE,
      url text NOT NULL,
      name text,
      visible boolean DEFAULT true NOT NULL,
      created_at timestamp DEFAULT now(),
      updated_at timestamp DEFAULT now()
    )
  `);
  bootstrapped = true;
}

function decorate(row: {
  id: number;
  countryCode: string;
  url: string;
  name: string | null;
  visible: boolean;
}): DistributorEntry {
  return {
    ...row,
    countryName: countryName(row.countryCode) ?? row.countryCode,
  };
}

/** Every distributor, hidden ones included. Seeds the defaults on first run. */
export async function getAllDistributors(): Promise<DistributorEntry[]> {
  await ensureTable();

  const existing = await db
    .select()
    .from(distributors)
    .orderBy(asc(distributors.countryCode));

  if (existing.length === 0) {
    await db
      .insert(distributors)
      .values(DEFAULT_DISTRIBUTORS)
      .onConflictDoNothing();
    const seeded = await db
      .select()
      .from(distributors)
      .orderBy(asc(distributors.countryCode));
    return sortByCountryName(seeded.map(decorate));
  }

  return sortByCountryName(existing.map(decorate));
}

/** Only the distributors that should show on the public site. */
export async function getVisibleDistributors(): Promise<DistributorEntry[]> {
  const all = await getAllDistributors();
  return all.filter((d) => d.visible);
} 

function sortByCountryName(list: DistributorEntry[]): DistributorEntry[] {
  return [...list].sort((a, b) => a.countryName.localeCompare(b.countryName));
}

export { ensureTable as ensureDistributorTable, DEFAULT_DISTRIBUTORS };

export async function deleteDistributor(id: number) {
  await ensureTable();
  const [deleted] = await db
    .delete(distributors)
    .where(eq(distributors.id, id))
    .returning();
  return deleted ?? null;
}
