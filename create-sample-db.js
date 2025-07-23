const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function createSampleDatabase() {
  // Veritabanını oluştur
  const db = await open({
    filename: './sample-hospital.db',
    driver: sqlite3.Database
  });

  // Tabloları oluştur
  await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      birth_date DATE,
      phone TEXT,
      email TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      specialty TEXT,
      phone TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS treatments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      treatment_date DATE NOT NULL,
      treatment_type TEXT NOT NULL,
      description TEXT,
      total_fee DECIMAL(10,2) DEFAULT 0,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      doctor_id INTEGER NOT NULL,
      appointment_date DATETIME NOT NULL,
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id),
      FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    );
  `);

  // Örnek veriler ekle
  await db.exec(`
    INSERT OR IGNORE INTO patients (id, name, birth_date, phone, email) VALUES
    (1, 'Ahmet Yılmaz', '1985-03-15', '0532 123 4567', 'ahmet@email.com'),
    (2, 'Fatma Demir', '1990-07-22', '0533 234 5678', 'fatma@email.com'),
    (3, 'Mehmet Kaya', '1978-11-08', '0534 345 6789', 'mehmet@email.com'),
    (4, 'Ayşe Özkan', '1992-05-12', '0535 456 7890', 'ayse@email.com'),
    (5, 'Ali Çelik', '1983-09-30', '0536 567 8901', 'ali@email.com');

    INSERT OR IGNORE INTO doctors (id, name, specialty, phone, email) VALUES
    (1, 'Dr. Hasan Yıldız', 'Kardiyoloji', '0537 678 9012', 'hasan@hospital.com'),
    (2, 'Dr. Zeynep Arslan', 'Nöroloji', '0538 789 0123', 'zeynep@hospital.com'),
    (3, 'Dr. Mustafa Koç', 'Ortopedi', '0539 890 1234', 'mustafa@hospital.com'),
    (4, 'Dr. Elif Şahin', 'Dahiliye', '0540 901 2345', 'elif@hospital.com');

    INSERT OR IGNORE INTO treatments (id, patient_id, doctor_id, treatment_date, treatment_type, description, total_fee) VALUES
    (1, 1, 1, '2024-01-15', 'Kardiyoloji Muayenesi', 'Rutin kalp kontrolü', 500.00),
    (2, 2, 2, '2024-01-16', 'Nöroloji Muayenesi', 'Baş ağrısı şikayeti', 600.00),
    (3, 3, 3, '2024-01-17', 'Ortopedi Muayenesi', 'Bel ağrısı tedavisi', 450.00),
    (4, 4, 4, '2024-01-18', 'Dahiliye Muayenesi', 'Genel sağlık kontrolü', 400.00),
    (5, 5, 1, '2024-01-19', 'Kardiyoloji Muayenesi', 'EKG çekimi', 550.00),
    (6, 1, 2, '2024-01-20', 'Nöroloji Muayenesi', 'Migren tedavisi', 650.00),
    (7, 2, 3, '2024-01-21', 'Ortopedi Muayenesi', 'Diz ağrısı tedavisi', 480.00),
    (8, 3, 4, '2024-01-22', 'Dahiliye Muayenesi', 'Kan tahlili', 350.00);

    INSERT OR IGNORE INTO appointments (id, patient_id, doctor_id, appointment_date, status) VALUES
    (1, 1, 1, '2024-02-01 10:00:00', 'scheduled'),
    (2, 2, 2, '2024-02-01 11:00:00', 'scheduled'),
    (3, 3, 3, '2024-02-01 14:00:00', 'scheduled'),
    (4, 4, 4, '2024-02-01 15:00:00', 'scheduled'),
    (5, 5, 1, '2024-02-02 09:00:00', 'scheduled');
  `);

  console.log('Örnek veritabanı başarıyla oluşturuldu: sample-hospital.db');
  console.log('Tablolar: patients, doctors, treatments, appointments');
  console.log('Örnek veriler eklendi.');

  await db.close();
}

createSampleDatabase().catch(console.error); 