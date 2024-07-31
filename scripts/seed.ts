import { categories, transactions } from "@/db/schema";
import { convertAmountInCents } from "@/lib/utils";
import { neon } from "@neondatabase/serverless";
import { eachDayOfInterval, subDays } from "date-fns";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

const SEED_USER_ID = 'user_2jgq1akKFpv0OuoqraC9TdQRb5j';
const SEED_CATEGORIES = [
  { id: 'category_1', name: 'Food', icon: '🍔', userId: SEED_USER_ID },
  { id: 'category_2', name: 'Transport', icon: '🚗', userId: SEED_USER_ID },
  { id: 'category_3', name: 'Health', icon: '💊', userId: SEED_USER_ID },
  { id: 'category_4', name: 'Entertainment', icon: '🎉', userId: SEED_USER_ID },
  { id: 'category_5', name: 'Education', icon: '📚', userId: SEED_USER_ID },
  { id: 'category_6', name: 'Others', icon: '💰', userId: SEED_USER_ID },
];

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

const generateRandomAmount = (category: typeof categories.$inferInsert) => {
  switch (category.name) {
    case 'Food':
      return Math.random() * 100;
    case 'Transport':
      return Math.random() * 50;
    case 'Health':
      return Math.random() * 200;
    case 'Entertainment':
      return Math.random() * 150;
    case 'Education':
      return Math.random() * 300;
    default:
      return Math.random() * 50;
  }
}

const SEED_TRANSACTIONS: typeof transactions.$inferInsert[] = [];
const generateTransactionsForDay = (day: Date) => {
  const numTransactions = Math.floor(Math.random() * 4) + 1; // 1 to 5 transactions

  for (let i = 0; i < numTransactions; i++) {
    const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];

    const isExpense = Math.random() > 0.6;
    const amount = generateRandomAmount(category);
    const formattedAmount = convertAmountInCents(isExpense ? -amount : amount);

    SEED_TRANSACTIONS.push({
      id: `transaction_${day.toISOString()}_${i}`,
      title: `Transaction ${SEED_TRANSACTIONS.length + 1}`,
      date: day,
      amount: formattedAmount,
      categoryId: category.id,
      userId: SEED_USER_ID,
    })
  }
}

const generateTransactions = () => {
  const days = eachDayOfInterval({
    start: defaultFrom,
    end: defaultTo
  });
  days.forEach(day => {
    generateTransactionsForDay(day);
  })
};

generateTransactions();

const main = async () => {
  try {
    // Reset database
    await db.delete(transactions).execute();
    await db.delete(categories).execute();

    // Seed categories
    await db.insert(categories).values(SEED_CATEGORIES).execute();

    // Seed transactions
    await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
  } catch (error) {
    console.error('Seed failed', error);
    process.exit(1);
  }
}

main();