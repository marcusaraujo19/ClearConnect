import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { initDatabase } from '@/services/database';

interface DatabaseContextProps {
  db: SQLite.SQLiteDatabase | null;
  isLoading: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextProps>({
  db: null,
  isLoading: true,
  error: null,
});

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = SQLite.openDatabase('cleanconnect.db');
        await initDatabase(database);
        setDb(database);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown database error'));
        console.error('Database initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    setupDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isLoading, error }}>
      {children}
    </DatabaseContext.Provider>
  );
};