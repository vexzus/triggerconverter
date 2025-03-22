document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const convertButton = document.getElementById('convert-button');
    
    

    convertButton.addEventListener('click', function () {
        const inputValue = input.value.trim();
        const lines = inputValue.split('\n');
        let result = [];
        let insideThread = false;
        let indentLevel = 0;

        lines.forEach((line, index) => {
            let trimmedLine = line.trim();

            // Sprawdzanie bloków i ustawianie wcięć
            if (trimmedLine.startsWith("Citizen.CreateThread")) {
                insideThread = true;
            }
            if (trimmedLine.endsWith("end)")) {
                insideThread = false;
            }

            // Liczenie poziomu wcięć
            if (trimmedLine.endsWith("do") || trimmedLine.includes("function(")) {
                indentLevel++;
            }

            if (trimmedLine.includes("TriggerServerEvent")) {
                const match = trimmedLine.match(/TriggerServerEvent\('([^']+)'\s*(?:,\s*(.*))?\)/);
                if (match) {
                    const eventName = match[1];
                    const params = match[2] ? match[2].trim() : '';

                    // Jeśli są argumenty, dodaj je w []
                    if (params) {
                        result.push(`${'    '.repeat(indentLevel)}'${eventName}'`);
                        result.push(`${'    '.repeat(indentLevel)}[${params}]`);
                    } else {
                        result.push(`${'    '.repeat(indentLevel)}TriggerEvent('${eventName}')`);
                    }
                    result.push(`${'    '.repeat(indentLevel)}-- LeakM.fun`);
                } else {
                    result.push(`${'    '.repeat(indentLevel)}${trimmedLine}`);
                }
            } else if (trimmedLine.startsWith("'") && (lines[index + 1]?.includes('[') || lines[index + 1]?.trim() === '')) {
                const eventName = trimmedLine.replace(/'/g, '').trim();
                const paramsLine = lines[index + 1]?.trim();
                
                const params = paramsLine && paramsLine.startsWith('[') ? paramsLine.replace(/[\[\]]/g, '').trim() : '';

                if (params) {
                    result.push(`${'    '.repeat(indentLevel)}TriggerServerEvent('${eventName}', ${params})`);
                } else {
                    result.push(`${'    '.repeat(indentLevel)}TriggerServerEvent('${eventName}')`);
                }
            } else {
                result.push(`${'    '.repeat(indentLevel)}${trimmedLine}`);
            }

            if (trimmedLine === "end" || trimmedLine === "end)") {
                indentLevel = Math.max(0, indentLevel - 1);
            }
        });

        output.value = result.join('\n');
    });
});