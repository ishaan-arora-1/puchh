// Configuration for Google Sheets API
const SPREADSHEET_ID = "1MussZ5RJ6yblFHQ6f-XyLsm6-_RHRBeLV7dr3NA66UU";
const API_KEY = "AIzaSyCxvHZNW0bYS7TL3U4WPSEkxlwacRhGSaQ";
const RANGE = "Sheet1";

// Make API_KEY available globally for use in HTML
if (typeof window !== 'undefined') {
    window.API_KEY = API_KEY;
}

/**
 * Fetches data from Google Sheets API
 * @returns {Promise<Array>} Array of rows from the sheet
 */
async function fetchGoogleSheetData() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        
        console.log("Fetching data from Google Sheet...");
        console.log("URL:", url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.values || [];
        
    } catch (error) {
        console.error("Error fetching sheet data:", error);
        throw error;
    }
}

/**
 * Prints the sheet data in a formatted way
 * @param {Array} data - Array of rows from the sheet
 */
function printSheetData(data) {
    if (!data || data.length === 0) {
        console.log("No data found in the sheet");
        return;
    }
    
    console.log("\n" + "=".repeat(80));
    console.log("GOOGLE SHEET DATA");
    console.log("=".repeat(80));
    
    // Print header
    if (data[0]) {
        console.log("\n📋 HEADERS:");
        console.log("-".repeat(40));
        data[0].forEach((header, index) => {
            console.log(`${index + 1}. ${header}`);
        });
    }
    
    // Print data rows
    console.log(`\n📊 DATA ROWS (${data.length - 1} rows):`);
    console.log("-".repeat(40));
    
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        console.log(`\nRow ${i}:`);
        row.forEach((cell, cellIndex) => {
            const header = data[0] && data[0][cellIndex] ? data[0][cellIndex] : `Column ${cellIndex + 1}`;
            console.log(`  ${header}: ${cell || '(empty)'}`);
        });
    }
    
    console.log("\n" + "=".repeat(80));
    console.log(`Total rows: ${data.length}`);
    console.log(`Data columns: ${data[0] ? data[0].length : 0}`);
    console.log("=".repeat(80));
}

/**
 * Main function to fetch and display sheet data
 */
async function main() {
    try {
        console.log("🚀 Starting Google Sheet data fetch...");
        
        const sheetData = await fetchGoogleSheetData();
        printSheetData(sheetData);
        
        // Also return the data for potential further use
        return sheetData;
        
    } catch (error) {
        console.error("❌ Failed to fetch sheet data:", error.message);
        return null;
    }
}

/**
 * Function to get specific row by index
 * @param {number} rowIndex - Index of the row (0-based)
 * @returns {Promise<Array|null>} Row data or null if not found
 */
async function getRowByIndex(rowIndex) {
    try {
        const data = await fetchGoogleSheetData();
        if (data && data[rowIndex]) {
            console.log(`\n📋 Row ${rowIndex}:`, data[rowIndex]);
            return data[rowIndex];
        } else {
            console.log(`Row ${rowIndex} not found`);
            return null;
        }
    } catch (error) {
        console.error("Error getting row:", error);
        return null;
    }
}

/**
 * Function to search for data by column value
 * @param {string} columnName - Name of the column to search in
 * @param {string} searchValue - Value to search for
 * @returns {Promise<Array|null>} Matching row or null if not found
 */
async function searchByColumn(columnName, searchValue) {
    try {
        const data = await fetchGoogleSheetData();
        if (!data || data.length === 0) return null;
        
        const headers = data[0];
        const columnIndex = headers.findIndex(header => 
            header.toLowerCase().includes(columnName.toLowerCase())
        );
        
        if (columnIndex === -1) {
            console.log(`Column "${columnName}" not found`);
            return null;
        }
        
        for (let i = 1; i < data.length; i++) {
            if (data[i][columnIndex] && 
                data[i][columnIndex].toLowerCase().includes(searchValue.toLowerCase())) {
                console.log(`\n🔍 Found match in row ${i}:`, data[i]);
                return data[i];
            }
        }
        
        console.log(`No matches found for "${searchValue}" in column "${columnName}"`);
        return null;
        
    } catch (error) {
        console.error("Error searching data:", error);
        return null;
    }
}

/**
 * WhatsApp API Configuration
 */
const WHATSAPP_CONFIG = {
    phoneNumberId: "685359688002551",
    accessToken: "EAAPXGZAZBEI54BPCxoAQtqWbZCD9Wi36ZCbMmwY2x9y4XkLL9nIKSB7lu9AAQciYLZCDcxYhXrj6KIR403Y7SzwYapm1vxODpUTFnjqh7yDzaVjuWlg4WPQdZBhQFSO6o9pT6t6Obw50kOBMMmLTUQJ25MUCxauOufVOVdELbntOhjRr8EksVMDI1doeXJPVJAsLv9FFTa8GA8ReofZAqX95onUW9MrcugpF4ZBeNzQpJgZDZD",
    recipientNumber: "919821430047"
};
if (typeof window !== 'undefined') {
    window.WHATSAPP_CONFIG = WHATSAPP_CONFIG;
}

/**
 * Sends a WhatsApp message using Facebook Graph API
 * @param {string} message - The message to send
 * @returns {Promise<Object>} Response from the API
 */
async function sendWhatsAppMessage(message) {
    try {
        const url = `https://graph.facebook.com/v22.0/${WHATSAPP_CONFIG.phoneNumberId}/messages`;
        
        const payload = {
            messaging_product: "whatsapp",
            to: WHATSAPP_CONFIG.recipientNumber,
            type: "text",
            text: {
                body: message
            }
        };

        console.log("📱 Sending WhatsApp message...");
        console.log("Message:", message);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok) {
            const apiError = (result && result.error && result.error.message) ? result.error.message : JSON.stringify(result);
            console.error("❌ Failed to send WhatsApp message:", result);
            throw new Error(apiError);
        }
        console.log("✅ WhatsApp message sent successfully!");
        console.log("Response:", result);
        console.log("📋 Debug Info:");
        console.log("  Phone Number ID:", WHATSAPP_CONFIG.phoneNumberId);
        console.log("  Recipient:", WHATSAPP_CONFIG.recipientNumber);
        console.log("  Message ID:", result.messages?.[0]?.id);
        console.log("  API Version: v22.0");
        return result;

    } catch (error) {
        console.error("❌ Error sending WhatsApp message:", error);
        throw error;
    }
}

/**
 * Sends a WhatsApp template message (opens conversation outside 24h window)
 * @param {string} templateName - e.g. 'hello_world'
 * @param {string} languageCode - e.g. 'en_US'
 * @param {Array} components - optional template components
 * @returns {Promise<Object>} API response
 */
async function sendWhatsAppTemplate(templateName = 'hello_world', languageCode = 'en_US', components = []) {
  try {
    const url = `https://graph.facebook.com/v22.0/${WHATSAPP_CONFIG.phoneNumberId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      to: WHATSAPP_CONFIG.recipientNumber,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        ...(components && components.length ? { components } : {})
      }
    };
    console.log(`📄 Sending template: ${templateName} (${languageCode})`);
    const response = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${WHATSAPP_CONFIG.accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) {
      const apiError = (result && result.error && result.error.message) ? result.error.message : JSON.stringify(result);
      console.error("❌ Failed to send WhatsApp template:", result);
      throw new Error(apiError);
    }
    console.log("✅ Template sent successfully!", result);
    return result;
  } catch (error) {
    console.error("❌ Error sending WhatsApp template:", error);
    throw error;
  }
}

/**
 * Finds products with quantity less than 5 and sends WhatsApp notifications
 * @param {number} threshold - Quantity threshold (default: 5)
 * @returns {Promise<Array>} Array of low stock products
 */
async function checkLowStockAndNotify(threshold = 5) {
    try {
        console.log(`🔍 Checking for products with quantity less than ${threshold}...`);
        
        const sheetData = await fetchGoogleSheetData();
        if (!sheetData || sheetData.length < 2) {
            console.log("No data found or insufficient data");
            return [];
        }

        const headers = sheetData[0];
        const dataRows = sheetData.slice(1);
        
        // Find columns by common names (case-insensitive)
        const findColumnIndex = (columnNames) => {
            for (const name of columnNames) {
                const index = headers.findIndex(header => 
                    header && header.toLowerCase().includes(name.toLowerCase())
                );
                if (index !== -1) return index;
            }
            return -1;
        };

        const quantityIndex = findColumnIndex(['quantity', 'qty', 'stock', 'pieces', 'units']);
        const nameIndex = findColumnIndex(['name', 'product', 'item', 'title']);
        const distributorIndex = findColumnIndex(['distributor', 'supplier', 'vendor', 'source']);
        const boughtPriceIndex = findColumnIndex(['bought', 'cost', 'purchase', 'buy price']);
        const soldUnitsIndex = findColumnIndex(['sold', 'units sold', 'sales', 'quantity sold']);

        console.log("📊 Column mapping:");
        console.log(`  Quantity: ${quantityIndex !== -1 ? headers[quantityIndex] : 'Not found'}`);
        console.log(`  Name: ${nameIndex !== -1 ? headers[nameIndex] : 'Not found'}`);
        console.log(`  Distributor: ${distributorIndex !== -1 ? headers[distributorIndex] : 'Not found'}`);
        console.log(`  Bought Price: ${boughtPriceIndex !== -1 ? headers[boughtPriceIndex] : 'Not found'}`);
        console.log(`  Sold Units: ${soldUnitsIndex !== -1 ? headers[soldUnitsIndex] : 'Not found'}`);

        const lowStockProducts = [];

        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            
            // Get quantity value
            let quantity = 0;
            if (quantityIndex !== -1 && row[quantityIndex]) {
                quantity = parseFloat(row[quantityIndex]) || 0;
            }

            // Check if quantity is below threshold
            if (quantity < threshold) {
                const productName = nameIndex !== -1 && row[nameIndex] ? row[nameIndex] : 'Unknown';
                const distributor = distributorIndex !== -1 && row[distributorIndex] ? row[distributorIndex] : 'Unknown';
                const boughtPrice = boughtPriceIndex !== -1 && row[boughtPriceIndex] ? row[boughtPriceIndex] : 'Unknown';
                const soldUnits = soldUnitsIndex !== -1 && row[soldUnitsIndex] ? row[soldUnitsIndex] : 'Unknown';

                const lowStockProduct = {
                    name: productName,
                    quantity: quantity,
                    distributor: distributor,
                    boughtPrice: boughtPrice,
                    soldUnits: soldUnits,
                    rowIndex: i + 1
                };

                lowStockProducts.push(lowStockProduct);

                // Create message
                const message = `🚨 LOW STOCK ALERT 🚨\n\nProduct "${productName}" has only ${quantity} pieces left.\n\nWe suggest you buy it from ${distributor}.\n\nYou bought it for ${boughtPrice} and you sold ${soldUnits} units.`;

                console.log(`\n📦 Low stock product found:`);
                console.log(`  Name: ${productName}`);
                console.log(`  Quantity: ${quantity}`);
                console.log(`  Distributor: ${distributor}`);
                console.log(`  Bought Price: ${boughtPrice}`);
                console.log(`  Sold Units: ${soldUnits}`);

                // Send WhatsApp message
                try {
                    await sendWhatsAppMessage(message);
                } catch (error) {
                    console.error(`Failed to send message for ${productName}:`, error);
                }

                // Add delay between messages to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`  Total products checked: ${dataRows.length}`);
        console.log(`  Low stock products found: ${lowStockProducts.length}`);
        
        if (lowStockProducts.length === 0) {
            console.log("✅ No products found with low stock!");
        } else {
            console.log("📱 WhatsApp notifications sent for all low stock products!");
        }

        return lowStockProducts;

    } catch (error) {
        console.error("❌ Error checking low stock:", error);
        return [];
    }
}

/**
 * Function to manually trigger low stock check
 * @param {number} threshold - Quantity threshold (default: 5)
 */
async function triggerLowStockCheck(threshold = 5) {
    console.log("🚀 Starting low stock check and notification process...");
    const lowStockProducts = await checkLowStockAndNotify(threshold);
    return lowStockProducts;
}

/**
 * Finds products nearing expiry date and sends WhatsApp notifications
 * @param {number} daysThreshold - Days before expiry to start alerting (default: 30)
 * @returns {Promise<Array>} Array of products nearing expiry
 */
async function checkExpiryAndNotify(daysThreshold = 30) {
    try {
        console.log(`🔍 Checking for products expiring within ${daysThreshold} days...`);
        
        const sheetData = await fetchGoogleSheetData();
        if (!sheetData || sheetData.length < 2) {
            console.log("No data found or insufficient data");
            return [];
        }

        const headers = sheetData[0];
        const dataRows = sheetData.slice(1);
        
        // Find columns by common names (case-insensitive)
        const findColumnIndex = (columnNames) => {
            for (const name of columnNames) {
                const index = headers.findIndex(header => 
                    header && header.toLowerCase().includes(name.toLowerCase())
                );
                if (index !== -1) return index;
            }
            return -1;
        };

        const expiryIndex = findColumnIndex(['expiry', 'expiry date', 'expiration', 'expires', 'best before', 'use by']);
        const nameIndex = findColumnIndex(['name', 'product', 'item', 'title']);
        const quantityIndex = findColumnIndex(['quantity', 'qty', 'stock', 'pieces', 'units']);

        console.log("📊 Column mapping for expiry check:");
        console.log(`  Expiry Date: ${expiryIndex !== -1 ? headers[expiryIndex] : 'Not found'}`);
        console.log(`  Product Name: ${nameIndex !== -1 ? headers[nameIndex] : 'Not found'}`);
        console.log(`  Quantity: ${quantityIndex !== -1 ? headers[quantityIndex] : 'Not found'}`);

        if (expiryIndex === -1) {
            console.log("❌ No expiry date column found in the sheet");
            return [];
        }

        const today = new Date();
        const thresholdDate = new Date();
        thresholdDate.setDate(today.getDate() + daysThreshold);

        const expiringProducts = [];
        let nearbyPlaces = null;

        // Check if we have any expiring products first
        let hasExpiringProducts = false;
        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            let expiryDate = null;
            
            if (expiryIndex !== -1 && row[expiryIndex]) {
                const expiryString = row[expiryIndex].toString().trim();
                
                // Try different date formats
                const dateFormats = [
                    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
                    /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
                    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
                    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/
                ];

                for (const format of dateFormats) {
                    const match = expiryString.match(format);
                    if (match) {
                        let year, month, day;
                        
                        if (match[1].length === 4) {
                            year = parseInt(match[1]);
                            month = parseInt(match[2]) - 1;
                            day = parseInt(match[3]);
                        } else {
                            if (parseInt(match[1]) > 12) {
                                day = parseInt(match[1]);
                                month = parseInt(match[2]) - 1;
                                year = parseInt(match[3]);
                            } else {
                                month = parseInt(match[1]) - 1;
                                day = parseInt(match[2]);
                                year = parseInt(match[3]);
                            }
                        }
                        
                        expiryDate = new Date(year, month, day);
                        break;
                    }
                }

                if (!expiryDate) {
                    expiryDate = new Date(expiryString);
                    if (isNaN(expiryDate.getTime())) {
                        expiryDate = null;
                    }
                }
            }

            if (expiryDate && !isNaN(expiryDate.getTime())) {
                const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                if (daysUntilExpiry <= daysThreshold && daysUntilExpiry >= 0) {
                    hasExpiringProducts = true;
                    break;
                }
            }
        }

        // If we have expiring products, get nearby places
        if (hasExpiringProducts) {
            try {
                console.log("🏪 Finding nearby places for donation...");
                // Use the enhanced version with better error handling
                nearbyPlaces = await findNearbyPlacesEnhanced(API_KEY, 5000, {
                    fallbackLocation: { lat: 28.4089, lng: 77.3178 }, // Faridabad, Haryana
                    maxRetries: 2,
                    retryDelay: 1000
                });
                console.log("✅ Nearby places found:", {
                    gurudwaras: nearbyPlaces.gurudwaras.length,
                    mandirs: nearbyPlaces.mandirs.length,
                    ngos: nearbyPlaces.ngos.length
                });
            } catch (error) {
                console.error("❌ Error finding nearby places:", error);
                nearbyPlaces = null;
            }
        }

        // Now process each expiring product
        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            
            // Get expiry date
            let expiryDate = null;
            if (expiryIndex !== -1 && row[expiryIndex]) {
                const expiryString = row[expiryIndex].toString().trim();
                
                // Try different date formats
                const dateFormats = [
                    // DD/MM/YYYY or MM/DD/YYYY
                    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
                    // YYYY-MM-DD
                    /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
                    // DD-MM-YYYY
                    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
                    // MM-DD-YYYY
                    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/
                ];

                for (const format of dateFormats) {
                    const match = expiryString.match(format);
                    if (match) {
                        let year, month, day;
                        
                        if (match[1].length === 4) {
                            // YYYY-MM-DD format
                            year = parseInt(match[1]);
                            month = parseInt(match[2]) - 1; // Month is 0-indexed
                            day = parseInt(match[3]);
                        } else {
                            // DD/MM/YYYY or MM/DD/YYYY format
                            // Try to determine format by checking if first number > 12
                            if (parseInt(match[1]) > 12) {
                                // DD/MM/YYYY
                                day = parseInt(match[1]);
                                month = parseInt(match[2]) - 1;
                                year = parseInt(match[3]);
                            } else {
                                // MM/DD/YYYY
                                month = parseInt(match[1]) - 1;
                                day = parseInt(match[2]);
                                year = parseInt(match[3]);
                            }
                        }
                        
                        expiryDate = new Date(year, month, day);
                        break;
                    }
                }

                // If no format matched, try direct Date parsing
                if (!expiryDate) {
                    expiryDate = new Date(expiryString);
                    if (isNaN(expiryDate.getTime())) {
                        expiryDate = null;
                    }
                }
            }

            // Check if expiry date is approaching
            if (expiryDate && !isNaN(expiryDate.getTime())) {
                const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                
                if (daysUntilExpiry <= daysThreshold && daysUntilExpiry >= 0) {
                    const productName = nameIndex !== -1 && row[nameIndex] ? row[nameIndex] : 'Unknown';
                    const quantity = quantityIndex !== -1 && row[quantityIndex] ? row[quantityIndex] : 'Unknown';
                    
                    // Format expiry date for display
                    const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    const expiringProduct = {
                        name: productName,
                        expiryDate: expiryDate,
                        formattedExpiryDate: formattedExpiryDate,
                        daysUntilExpiry: daysUntilExpiry,
                        quantity: quantity,
                        rowIndex: i + 1
                    };

                    expiringProducts.push(expiringProduct);

                    // Create urgency level
                    let urgencyLevel = "⚠️";
                    if (daysUntilExpiry <= 7) urgencyLevel = "🚨";
                    else if (daysUntilExpiry <= 14) urgencyLevel = "🔥";
                    else if (daysUntilExpiry <= 30) urgencyLevel = "⚠️";

                    // Create message with nearby places information
                    let message = `${urgencyLevel} EXPIRY ALERT ${urgencyLevel}\n\nProduct "${productName}" has its expiry date ${formattedExpiryDate} approaching.\n\nDays until expiry: ${daysUntilExpiry} days\nCurrent stock: ${quantity} units\n\nTry to sell it out quick!`;

                    // Add nearby places information if available
                    if (nearbyPlaces) {
                        message += `\n\n🏪 NEARBY PLACES FOR DONATION:\n`;
                        
                        // Combine all places and limit to 5 total
                        let allPlaces = [];
                        
                        // Add gurudwaras
                        nearbyPlaces.gurudwaras.forEach(place => {
                            allPlaces.push({...place, type: 'Gurudwara', emoji: '🕉️'});
                        });
                        
                        // Add mandirs
                        nearbyPlaces.mandirs.forEach(place => {
                            allPlaces.push({...place, type: 'Mandir', emoji: '🕉️'});
                        });
                        
                        // Add NGOs
                        nearbyPlaces.ngos.forEach(place => {
                            allPlaces.push({...place, type: 'NGO', emoji: '🏛️'});
                        });
                        
                        // Limit to 5 places total
                        const limitedPlaces = allPlaces.slice(0, 5);
                        
                        if (limitedPlaces.length > 0) {
                            message += `\nFound ${limitedPlaces.length} nearby places:\n`;
                            limitedPlaces.forEach((place, index) => {
                                message += `\n${index + 1}. ${place.emoji} ${place.name} (${place.type})\n   📍 ${place.address}\n   📞 ${place.phoneNumber || 'No phone'}\n`;
                            });
                        } else {
                            message += `\nNo nearby places found for donation.`;
                        }
                        
                        message += `\n📍 View all places on Google Maps for more details.`;
                    }

                    console.log(`\n📅 Expiring product found:`);
                    console.log(`  Name: ${productName}`);
                    console.log(`  Expiry Date: ${formattedExpiryDate}`);
                    console.log(`  Days until expiry: ${daysUntilExpiry}`);
                    console.log(`  Current stock: ${quantity}`);
                    if (nearbyPlaces) {
                        console.log(`  Nearby places found: ${nearbyPlaces.gurudwaras.length + nearbyPlaces.mandirs.length + nearbyPlaces.ngos.length} total`);
                    }

                    // Send WhatsApp message
                    try {
                        console.log(`📱 Sending WhatsApp message for ${productName}...`);
                        console.log(`Message length: ${message.length} characters`);
                        const result = await sendWhatsAppMessage(message);
                        console.log(`✅ WhatsApp message sent successfully for ${productName}`);
                    } catch (error) {
                        console.error(`❌ Failed to send expiry message for ${productName}:`, error);
                    }

                    // Add delay between messages to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        console.log(`\n📊 Expiry Check Summary:`);
        console.log(`  Total products checked: ${dataRows.length}`);
        console.log(`  Products expiring within ${daysThreshold} days: ${expiringProducts.length}`);
        
        if (expiringProducts.length === 0) {
            console.log("✅ No products found nearing expiry!");
        } else {
            console.log("📱 WhatsApp notifications sent for all expiring products!");
            if (nearbyPlaces) {
                console.log("🏪 Nearby places information included in messages");
            }
        }

        return expiringProducts;

    } catch (error) {
        console.error("❌ Error checking expiry dates:", error);
        return [];
    }
}

/**
 * Function to manually trigger expiry check
 * @param {number} daysThreshold - Days before expiry to start alerting (default: 30)
 */
async function triggerExpiryCheck(daysThreshold = 30) {
    console.log("🚀 Starting expiry check and notification process...");
    const expiringProducts = await checkExpiryAndNotify(daysThreshold);
    return expiringProducts;
}

/**
 * Function to check both low stock and expiry in one go
 * @param {number} stockThreshold - Quantity threshold for low stock (default: 5)
 * @param {number} expiryThreshold - Days before expiry to alert (default: 30)
 */
async function checkInventoryAlerts(stockThreshold = 5, expiryThreshold = 30) {
    console.log("🚀 Starting comprehensive inventory alert check...");
    
    console.log("\n" + "=".repeat(60));
    console.log("LOW STOCK CHECK");
    console.log("=".repeat(60));
    const lowStockProducts = await checkLowStockAndNotify(stockThreshold);
    
    console.log("\n" + "=".repeat(60));
    console.log("EXPIRY DATE CHECK");
    console.log("=".repeat(60));
    const expiringProducts = await checkExpiryAndNotify(expiryThreshold);
    
    console.log("\n" + "=".repeat(60));
    console.log("FINAL SUMMARY");
    console.log("=".repeat(60));
    console.log(`📦 Low stock products: ${lowStockProducts.length}`);
    console.log(`📅 Expiring products: ${expiringProducts.length}`);
    console.log(`📱 Total notifications sent: ${lowStockProducts.length + expiringProducts.length}`);
    
    return {
        lowStock: lowStockProducts,
        expiring: expiringProducts
    };
}

/**
 * Test function to verify WhatsApp messaging with nearby places
 * @param {number} daysThreshold - Days threshold for testing (default: 30)
 */
async function testExpiryWithPlaces(daysThreshold = 30) {
    console.log("🧪 Testing expiry check with nearby places...");
    
    try {
        // First, get nearby places using enhanced function
        console.log("🏪 Getting nearby places...");
        const nearbyPlaces = await findNearbyPlacesEnhanced(API_KEY, 5000, {
            fallbackLocation: { lat: 28.4089, lng: 77.3178 }, // Faridabad, Haryana
            maxRetries: 2,
            retryDelay: 1000
        });
        console.log("✅ Nearby places found:", {
            gurudwaras: nearbyPlaces.gurudwaras.length,
            mandirs: nearbyPlaces.mandirs.length,
            ngos: nearbyPlaces.ngos.length
        });
        
        // Create a test message with nearby places
        let testMessage = `🧪 TEST: EXPIRY ALERT WITH NEARBY PLACES 🧪\n\nProduct "Test Product" has its expiry date December 15, 2024 approaching.\n\nDays until expiry: 5 days\nCurrent stock: 10 units\n\nTry to sell it out quick!`;
        
        // Add nearby places information
        if (nearbyPlaces) {
            testMessage += `\n\n🏪 NEARBY PLACES FOR DONATION:\n`;
            
            // Combine all places and limit to 5 total
            let allPlaces = [];
            
            // Add gurudwaras
            nearbyPlaces.gurudwaras.forEach(place => {
                allPlaces.push({...place, type: 'Gurudwara', emoji: '🕉️'});
            });
            
            // Add mandirs
            nearbyPlaces.mandirs.forEach(place => {
                allPlaces.push({...place, type: 'Mandir', emoji: '🕉️'});
            });
            
            // Add NGOs
            nearbyPlaces.ngos.forEach(place => {
                allPlaces.push({...place, type: 'NGO', emoji: '🏛️'});
            });
            
            // Limit to 5 places total
            const limitedPlaces = allPlaces.slice(0, 5);
            
            if (limitedPlaces.length > 0) {
                testMessage += `\nFound ${limitedPlaces.length} nearby places:\n`;
                limitedPlaces.forEach((place, index) => {
                    testMessage += `\n${index + 1}. ${place.emoji} ${place.name} (${place.type})\n   📍 ${place.address}\n   📞 ${place.phoneNumber || 'No phone'}\n`;
                });
            } else {
                testMessage += `\nNo nearby places found for donation.`;
            }
            
            testMessage += `\n📍 View all places on Google Maps for more details.`;
        }
        
        console.log("📱 Sending test WhatsApp message...");
        console.log("Message length:", testMessage.length, "characters");
        console.log("Message preview:", testMessage.substring(0, 200) + "...");
        
        const result = await sendWhatsAppMessage(testMessage);
        console.log("✅ Test message sent successfully!");
        console.log("Result:", result);
        
        return result;
        
    } catch (error) {
        console.error("❌ Test failed:", error);
        throw error;
    }
}

// Export functions for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchGoogleSheetData,
        printSheetData,
        main,
        getRowByIndex,
        searchByColumn,
        sendWhatsAppMessage,
        checkLowStockAndNotify,
        triggerLowStockCheck,
        checkExpiryAndNotify,
        triggerExpiryCheck,
        checkInventoryAlerts,
        testExpiryWithPlaces,
        findNearbyPlaces,
        findNearbyPlacesEnhanced,
        testPlacesAPI,
        sendWhatsAppTemplate
    };
}

// Auto-execute main function when script is loaded
if (typeof window !== 'undefined') {
    // Browser environment
    window.fetchGoogleSheetData = fetchGoogleSheetData;
    window.printSheetData = printSheetData;
    window.getRowByIndex = getRowByIndex;
    window.searchByColumn = searchByColumn;
    window.sendWhatsAppMessage = sendWhatsAppMessage;
    window.checkLowStockAndNotify = checkLowStockAndNotify;
    window.triggerLowStockCheck = triggerLowStockCheck;
    window.checkExpiryAndNotify = checkExpiryAndNotify;
    window.triggerExpiryCheck = triggerExpiryCheck;
    window.checkInventoryAlerts = checkInventoryAlerts;
    window.testExpiryWithPlaces = testExpiryWithPlaces;
    window.findNearbyPlaces = findNearbyPlaces;
    window.findNearbyPlacesEnhanced = findNearbyPlacesEnhanced;
    window.testPlacesAPI = testPlacesAPI;
    window.sendWhatsAppTemplate = sendWhatsAppTemplate;
    
    // Auto-run when script loads
    main();
} else {
    // Node.js environment
    main();
}

// ========================================
// AUTOMATIC EXECUTION DISABLED
// ========================================
// Functions will only run when called manually via buttons
// To run all functions automatically, use the "🚀 RUN ALL FUNCTIONS" button











































/**
 * Find NGOs, Gurudwaras, and Mandirs near a given location
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} radius - Search radius in meters (default: 5000)
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise<Object>} Object containing arrays of found places by type
 */
async function findReligiousAndNGOPlaces(latitude, longitude, radius = 5000, apiKey) {
    const location = `${latitude},${longitude}`;
    
    // Define search types for different categories
    const searchQueries = {
      gurudwaras: 'gurudwara',
      mandirs: 'temple hindu mandir',
      ngos: 'ngo non-profit organization charity'
    };
    
    const results = {
      gurudwaras: [],
      mandirs: [],
      ngos: []
    };
    
    try {
      console.log(`🔍 Searching for places near coordinates: ${latitude}, ${longitude}`);
      
      // Search for each type of place
      for (const [category, query] of Object.entries(searchQueries)) {
        console.log(`Searching for ${category}...`);
        const places = await searchPlaces(location, radius, query, apiKey);
        results[category] = places;
        console.log(`Found ${places.length} ${category}`);
      }
      
      return results;
    } catch (error) {
      console.error('Error finding places:', error);
      // Still return partial results if some categories worked
      return results;
    }
  }
  
  /**
   * Search for places using Google Places API Text Search
   * @param {string} location - "lat,lng" format
   * @param {number} radius - Search radius in meters
   * @param {string} query - Search query
   * @param {string} apiKey - Google Maps API key
   * @returns {Promise<Array>} Array of place objects
   */
  async function searchPlaces(location, radius, query, apiKey) {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${location}&radius=${radius}&key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error(`Places API error for query "${query}": ${data.status}`);
        if (data.error_message) {
          console.error(`Error message: ${data.error_message}`);
        }
        return []; // Return empty array instead of throwing
      }
      
      // Process and format the results
      const places = [];
      
      for (const place of data.results || []) {
        try {
          const placeDetails = await getPlaceDetails(place.place_id, apiKey);
          places.push(formatPlaceInfo(place, placeDetails));
        } catch (detailError) {
          console.error(`Error getting details for place ${place.name}:`, detailError);
          // Still add the place with basic info
          places.push(formatPlaceInfo(place, {}));
        }
      }
      
      return places;
    } catch (error) {
      console.error('Error searching places:', error);
      return []; // Return empty array instead of throwing
    }
  }
  
  /**
   * Get detailed information about a place
   * @param {string} placeId - Google Place ID
   * @param {string} apiKey - Google Maps API key
   * @returns {Promise<Object>} Detailed place information
   */
  async function getPlaceDetails(placeId, apiKey) {
    const fields = 'formatted_phone_number,website,url';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.result;
      }
      
      return {};
    } catch (error) {
      console.error('Error getting place details:', error);
      return {};
    }
  }
  
  /**
   * Format place information into the required structure
   * @param {Object} place - Place object from Places API
   * @param {Object} details - Detailed place information
   * @returns {Object} Formatted place information
   */
  function formatPlaceInfo(place, details) {
    return {
      name: place.name,
      address: place.formatted_address,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      googleMapsLink: details.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
      phoneNumber: details.formatted_phone_number || null,
      website: details.website || null,
      rating: place.rating || null,
      placeId: place.place_id
    };
  }
  
  /**
   * Get user's current location using Geolocation API
   * @returns {Promise<Object>} Object with latitude and longitude
   */
  function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
  
  /**
   * Main function to find places near user's current location with fallback
   * @param {string} apiKey - Google Maps API key
   * @param {number} radius - Search radius in meters (default: 5000)
   * @param {Object} fallbackLocation - Optional fallback coordinates {lat, lng}
   * @returns {Promise<Object>} Object containing arrays of found places
   */
  async function findNearbyPlaces(apiKey, radius = 5000, fallbackLocation = null) {
    try {
      console.log("🌍 Attempting to get current location...");
      
      // Try to get user's current location first
      let location;
      try {
        location = await getCurrentLocation();
        console.log("✅ Got user location:", location);
      } catch (locationError) {
        console.warn("⚠️ Could not get user location:", locationError.message);
        
        // Use fallback location if provided
        if (fallbackLocation && fallbackLocation.lat && fallbackLocation.lng) {
          location = {
            latitude: fallbackLocation.lat,
            longitude: fallbackLocation.lng
          };
          console.log("🎯 Using fallback location:", location);
        } else {
          // Use Faridabad, Haryana as default fallback (since user is from there)
          location = {
            latitude: 28.4089,
            longitude: 77.3178
          };
          console.log("🏠 Using default location (Faridabad, Haryana):", location);
        }
      }
      
      // Find places near the location
      console.log("🔍 Searching for places...");
      const places = await findReligiousAndNGOPlaces(
        location.latitude, 
        location.longitude, 
        radius, 
        apiKey
      );
      
      console.log("✅ Places search completed");
      return places;
      
    } catch (error) {
      console.error('❌ Error in findNearbyPlaces:', error);
      
      // Return empty results instead of throwing
      return {
        gurudwaras: [],
        mandirs: [],
        ngos: []
      };
    }
  }
  
  /**
   * Enhanced function for finding places with better error handling
   * @param {string} apiKey - Google Maps API key
   * @param {number} radius - Search radius in meters
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Object containing arrays of found places
   */
  async function findNearbyPlacesEnhanced(apiKey, radius = 5000, options = {}) {
    const defaultOptions = {
      fallbackLocation: { lat: 28.4089, lng: 77.3178 }, // Faridabad, Haryana
      maxRetries: 2,
      retryDelay: 1000
    };
    
    const config = { ...defaultOptions, ...options };
    
    let places = {
      gurudwaras: [],
      mandirs: [],
      ngos: []
    };
    
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        console.log(`🚀 Attempt ${attempt + 1} to find nearby places...`);
        
        places = await findNearbyPlaces(apiKey, radius, config.fallbackLocation);
        
        // Check if we got any results
        const totalPlaces = places.gurudwaras.length + places.mandirs.length + places.ngos.length;
        
        if (totalPlaces > 0) {
          console.log(`✅ Found ${totalPlaces} places total`);
          break;
        } else if (attempt < config.maxRetries) {
          console.log(`⚠️ No places found, retrying in ${config.retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        }
        
      } catch (error) {
        console.error(`❌ Attempt ${attempt + 1} failed:`, error);
        
        if (attempt < config.maxRetries) {
          console.log(`⏳ Retrying in ${config.retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        }
      }
    }
    
    return places;
  }
  
  // Quick test function to verify the places API is working
  async function testPlacesAPI(apiKey) {
    console.log("🧪 Testing Places API...");
    
    try {
      // Test with Faridabad coordinates
      const places = await findReligiousAndNGOPlaces(28.4089, 77.3178, 5000, apiKey);
      
      console.log("✅ Places API test results:");
      console.log(`  Gurudwaras: ${places.gurudwaras.length}`);
      console.log(`  Mandirs: ${places.mandirs.length}`);
      console.log(`  NGOs: ${places.ngos.length}`);
      
      if (places.gurudwaras.length > 0) {
        console.log("  Sample Gurudwara:", places.gurudwaras[0].name);
      }
      if (places.mandirs.length > 0) {
        console.log("  Sample Mandir:", places.mandirs[0].name);
      }
      if (places.ngos.length > 0) {
        console.log("  Sample NGO:", places.ngos[0].name);
      }
      
      return places;
      
    } catch (error) {
      console.error("❌ Places API test failed:", error);
      return null;
    }
  }