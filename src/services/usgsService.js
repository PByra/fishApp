/**
 * USGS Water Services — real-time gage height for WI river spots
 *
 * API: https://waterservices.usgs.gov/nwis/iv/
 * Parameter 00065 = gage height (feet)
 * Period P7D = last 7 days of readings (used to compute 7-day average)
 *
 * Returns a condition object or null on network failure / no data.
 */

const USGS_BASE = 'https://waterservices.usgs.gov/nwis/iv/';

/**
 * Gauge station IDs for WI river spots in this app.
 * Milwaukee River:  04087000  (Milwaukee River at Milwaukee)
 * Lemonweir River:  05403500  (Lemonweir River near New Lisbon, WI)
 */
export const WI_GAUGES = {
  MILWAUKEE_RIVER: '04087000',
  LEMONWEIR_RIVER: '05403500',
};

/**
 * Fetch real-time gage height + 7-day average for a USGS gauge station.
 *
 * @param {string} siteId  USGS site number (e.g. '04087000')
 * @returns {Promise<{
 *   gageHeight: string,   // current reading, feet (e.g. '3.42')
 *   sevenDayAvg: string,  // 7-day mean, feet
 *   ratio: string,        // current / avg (e.g. '1.62')
 *   mudRisk: boolean,     // true if current > 1.5× 7-day avg
 *   label: string,        // human-readable condition label
 * } | null>}
 */
export async function fetchGaugeCondition(siteId) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const url =
      `${USGS_BASE}?sites=${siteId}&parameterCd=00065&format=json&period=P7D`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const json = await res.json();
    const readings =
      json?.value?.timeSeries?.[0]?.values?.[0]?.value ?? [];

    if (readings.length === 0) return null;

    const numericValues = readings.map(v => parseFloat(v.value)).filter(n => !isNaN(n));
    if (numericValues.length === 0) return null;

    const current = numericValues[numericValues.length - 1];
    const avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
    const ratio = current / avg;

    let label;
    if (ratio > 1.5)      label = 'High Flow / Mud Risk';
    else if (ratio > 1.2) label = 'Slightly Elevated';
    else if (ratio < 0.7) label = 'Low Water';
    else                  label = 'Normal Flow';

    return {
      gageHeight:   current.toFixed(2),
      sevenDayAvg:  avg.toFixed(2),
      ratio:        ratio.toFixed(2),
      mudRisk:      ratio > 1.5,
      label,
    };
  } catch {
    return null;
  }
}
