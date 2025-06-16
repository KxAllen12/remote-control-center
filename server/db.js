import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const getDb = async () => {
    return open({
        filename: 'vms.sqlite',
        driver: sqlite3.Database
    });
};

export default getDb;