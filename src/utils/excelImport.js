import * as XLSX from 'xlsx';

export const parseDQEExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Logic to extract Lots, Sections and Articles from rows
        // This is a simplified heuristic: 
        // - Row with only one cell full = Lot
        // - Row with certain keywords = Header
        // - Row with numbers/units = Article
        
        let lots = [];
        let currentLot = null;
        let currentSection = null;

        // Skip headers (assume first 2-3 rows are headers)
        for (let i = 1; i < json.length; i++) {
          const row = json[i];
          if (!row || row.length === 0) continue;

          const col0 = String(row[0] || '').trim();
          const col1 = String(row[1] || '').trim();
          const col2 = String(row[2] || '').trim();

          // Case 1: Likely a LOT (Broad title)
          if (col1 && !col2 && !row[3]) {
             currentLot = { name: col1, sections: [] };
             lots.push(currentLot);
             currentSection = null;
             continue;
          }

          // Case 2: Likely a SECTION (If nested within a lot)
          if (col0.match(/^[A-Z]\.?$/) || (col1 && !row[4])) {
            if (!currentLot) {
              currentLot = { name: "Lot Général", sections: [] };
              lots.push(currentLot);
            }
            currentSection = { name: col1, articles: [] };
            currentLot.sections.push(currentSection);
            continue;
          }

          // Case 3: Likely an ARTICLE (Has code, designation, unit, qty, price)
          if (col0 && col1 && col2) {
            if (!currentSection) {
               if (!currentLot) {
                 currentLot = { name: "Lot Général", sections: [] };
                 lots.push(currentLot);
               }
               currentSection = { name: "Section Générale", articles: [] };
               currentLot.sections.push(currentSection);
            }

            currentSection.articles.push({
              code: col0,
              libelle: col1,
              unite: col2,
              quantite: parseFloat(row[3]) || 0,
              prixUnit: parseFloat(row[4]) || 0
            });
          }
        }

        resolve(lots);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
};
