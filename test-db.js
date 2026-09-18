import mysql from 'mysql2/promise';

async function testConnection() {
    console.log('Testing connection to 186.209.113.130...');
    try {
        const connection = await mysql.createConnection({
            host: '186.209.113.130',
            user: 'gmso3652_gmcell',
            password: 'VDIoFf04}of.X0Y[',
            database: 'gmso3652_gmcel'
        });
        console.log('✅ Connection successful!');
        const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
        console.log('Query result:', rows);
        await connection.end();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection();
