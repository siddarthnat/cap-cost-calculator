import { useState } from "react";

export default function App() {
  const [data, setData] = useState({
    shotWeight: 6.5,
    rmKg: 89,
    cavities: 8,
    cycleTime: 13.5,
    powerKwhHr: 50,
    powerRate: 8.25,
    labour: 81600,
    transport: 14000,
    ebCost: 18000,
    days: 26,
    hours: 22,
    packCost: 32,
    capsPerSack: 5000,
    margin: 0.25
  });

  const [capType, setCapType] = useState("53mm");
  const [history, setHistory] = useState([]);

  const minsMonth = data.days * data.hours * 60;
  const capsPerMin = (60 / data.cycleTime) * data.cavities;

  const capWeight = data.cavities ? data.shotWeight / data.cavities : 0;
  const rmCost = (data.rmKg / 1000) * capWeight;
  const labourCap = (data.labour / minsMonth) / capsPerMin;
  const transportCap = (data.transport / minsMonth) / capsPerMin;
  const powerCap =
    ((data.powerKwhHr * data.powerRate) / 60) / capsPerMin;
  const ebCap = (data.ebCost / minsMonth) / capsPerMin;
  const packCap = data.packCost / data.capsPerSack;

  const totalCost =
    rmCost + labourCap + transportCap + powerCap + packCap + ebCap;

  const sellingPrice = totalCost + data.margin;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: Number(e.target.value) });
  };

  const presets = {
    "96mm": { cavities: 4, capsPerSack: 2500 },
    "83mm": { cavities: 6, capsPerSack: 3000 },
    "96mm lollipop": { cavities: 4, capsPerSack: 2000 },
    "120mm": { cavities: 4, capsPerSack: 1500 },
    "53mm": { cavities: 8, capsPerSack: 5000 }
  };

  const handleCapTypeChange = (val) => {
    setCapType(val);
    const p = presets[val];
    if (p) setData((d) => ({ ...d, cavities: p.cavities, capsPerSack: p.capsPerSack }));
  };

  const handleGenerate = () => {
    const entry = {
      id: Date.now(),
      time: new Date().toLocaleString(),
      capType,
      capsPerMin: Number(capsPerMin.toFixed(2)),
      capWeight: Number(capWeight.toFixed(2)),
      rmCost: Number(rmCost.toFixed(2)),
      electricity: Number(powerCap.toFixed(2)),
      labour: Number(labourCap.toFixed(2)),
      transport: Number(transportCap.toFixed(2)),
      packaging: Number(packCap.toFixed(2)),
      eb: Number(ebCap.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      sellingPrice: Number(sellingPrice.toFixed(2))
    };

    setHistory((h) => [entry, ...h]);
  };

  function sanitizeFilename(s) {
    return s.replace(/[^0-9a-zA-Z-_\.]/g, "-");
  }

  function saveEntryAsTxt(entry) {
    const lines = [];
    lines.push(`Time: ${entry.time}`);
    lines.push(`Cap Type: ${entry.capType}`);
    lines.push(`Caps / Minute: ${entry.capsPerMin}`);
    lines.push(`Cap weight (g): ${entry.capWeight}`);
    lines.push(`Raw Material / Cap: ₹${entry.rmCost}`);
    lines.push(`Electricity / Cap: ₹${entry.electricity}`);
    lines.push(`Labour / Cap: ₹${entry.labour}`);
    lines.push(`Transport / Cap: ₹${entry.transport}`);
    lines.push(`Packaging / Cap: ₹${entry.packaging}`);
    lines.push(`EB / Cap: ₹${entry.eb}`);
    lines.push(`Total Cost / Cap: ₹${entry.totalCost}`);
    lines.push(`Selling Price / Cap: ₹${entry.sellingPrice}`);

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const filename = `cap-result-${sanitizeFilename(entry.time)}.txt`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    try { window.open(url, "_blank"); } catch (e) {}
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  function exportAll(entries) {
    const lines = [];
    entries.forEach((e, i) => {
      lines.push(`=== Entry ${i + 1} ===`);
      lines.push(`Time: ${e.time}`);
      lines.push(`Cap Type: ${e.capType}`);
      lines.push(`Caps / Minute: ${e.capsPerMin}`);
      lines.push(`Cap weight (g): ${e.capWeight}`);
      lines.push(`Raw Material / Cap: ₹${e.rmCost}`);
      lines.push(`Electricity / Cap: ₹${e.electricity}`);
      lines.push(`Labour / Cap: ₹${e.labour}`);
      lines.push(`Transport / Cap: ₹${e.transport}`);
      lines.push(`Packaging / Cap: ₹${e.packaging}`);
      lines.push(`EB / Cap: ₹${e.eb}`);
      lines.push(`Total Cost / Cap: ₹${e.totalCost}`);
      lines.push(`Selling Price / Cap: ₹${e.sellingPrice}`);
      lines.push("");
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const filename = `cap-history-${sanitizeFilename(new Date().toLocaleString())}.txt`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    try { window.open(url, "_blank"); } catch (e) {}
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  return (
    <div className="container card">
      <header className="header">
        <h1>Premium Plast Cap Cost Calculator</h1>
      </header>

      <div className="groups">
        <div className="group">
          <h3>Mould Running Configuration</h3>
          <div className="control">
            <label>Cap Type</label>
            <select value={capType} onChange={(e) => handleCapTypeChange(e.target.value)}>
              <option>53mm</option>
              <option>63mm</option>
              <option>83mm</option>
              <option>96mm</option>
              <option>96mm lollipop</option>
              <option>120mm</option>
            </select>
          </div>
          <div className="control">
            <label>Shot weight (g)</label>
            <input type="number" step="any" name="shotWeight" value={data.shotWeight} onChange={handleChange} />
          </div>
          <div className="control">
            <label>No. of Cavities</label>
            <input type="number" step="any" name="cavities" value={data.cavities} onChange={handleChange} />
          </div>
          <div className="control">
            <label>Cycle Time (s)</label>
            <input type="number" step="any" name="cycleTime" value={data.cycleTime} onChange={handleChange} />
          </div>
        </div>

        <div className="group">
          <h3>Electricity Costs</h3>
          <div className="control">
            <label>EB Consumption (kWh/hr)</label>
            <input type="number" step="any" name="powerKwhHr" value={data.powerKwhHr} onChange={handleChange} />
          </div>
          <div className="control">
            <label>Rate per Unit (₹/kWh)</label>
            <input type="number" step="any" name="powerRate" value={data.powerRate} onChange={handleChange} />
          </div>
          <div className="control">
            <label>Fixed Cost per Month (₹)</label>
            <input type="number" step="any" name="ebCost" value={data.ebCost} onChange={handleChange} />
          </div>
        </div>

        <div className="group">
          <h3>Packaging Costs</h3>
          <div className="control">
            <label>Cost per Sack (₹)</label>
            <input type="number" step="any" name="packCost" value={data.packCost} onChange={handleChange} />
          </div>
          <div className="control">
            <label>Count per Sack</label>
            <input type="number" step="any" name="capsPerSack" value={data.capsPerSack} onChange={handleChange} />
          </div>
        </div>

        <div className="group">
          <h3>Transport Charges</h3>
          <div className="control">
            <label>Per Month (₹)</label>
            <input type="number" step="any" name="transport" value={data.transport} onChange={handleChange} />
          </div>
        </div>

        <div className="group">
          <h3>Labour Costs</h3>
          <div className="control">
            <label>Per Month (₹)</label>
            <input type="number" step="any" name="labour" value={data.labour} onChange={handleChange} />
          </div>
        </div>

        <div className="group">
          <h3>Raw Material Costs</h3>
          <div className="control">
            <label>Material Cost per Kg (₹)</label>
            <input type="number" step="any" name="rmKg" value={data.rmKg} onChange={handleChange} />
          </div>
        </div>

        <div className="group">
          <h3>Running Details</h3>
          <div className="control">
            <label>No. of Days Run</label>
            <input type="number" step="any" name="days" value={data.days} onChange={handleChange} />
          </div>
          <div className="control">
            <label>No. of Hrs/Day</label>
            <input type="number" step="any" name="hours" value={data.hours} onChange={handleChange} />
          </div>
        </div>

        <div className="group">
          <h3>Margin Cost</h3>
          <div className="control">
            <label>Margin (₹)</label>
            <input type="number" step="any" name="margin" value={data.margin} onChange={handleChange} />
          </div>
        </div>
      </div>

      <hr />

      <section className="results">
        <h2>Results (Costs are shown per cap)</h2>
        <div className="results-grid">
          <div>Caps / Minute</div>
          <div className="strong">{capsPerMin.toFixed(2)}</div>

          <div>Cap weight (g)</div>
          <div className="strong">{capWeight.toFixed(2)} g</div>

          <div>Raw Material</div>
          <div className="strong">₹{rmCost.toFixed(2)}</div>

          <div>Electricity Consumption</div>
          <div className="strong">₹{powerCap.toFixed(2)}</div>

          <div>Labour</div>
          <div className="strong">₹{labourCap.toFixed(2)}</div>

          <div>Transport Charges</div>
          <div className="strong">₹{transportCap.toFixed(2)}</div>

          <div>Packaging Charges</div>
          <div className="strong">₹{packCap.toFixed(2)}</div>

          <div>EB Fixed Cost </div>
          <div className="strong">₹{ebCap.toFixed(2)}</div>

          <div className="muted">Total Cost / Cap</div>
          <div className="total">₹{totalCost.toFixed(2)}</div>

          <div className="muted">Margin / Cap</div>
          <div className="margin">₹{data.margin.toFixed(2)}</div>

          <div className="muted">Selling Price / Cap</div>
          <div className="price">₹{sellingPrice.toFixed(2)}</div>
        </div>
      </section>

      <div className="actions">
        <button className="btn" onClick={handleGenerate}>Generate & Save Result</button>
      </div>

      {history.length > 0 && (
        <section className="history">
          <h2>Generated Results (Session)</h2>
          <div style={{ marginBottom: 8 }}>
            <button className="btn small" onClick={() => exportAll(history)}>Export All to .txt</button>
          </div>
          <table className="history-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Cap Type</th>
                <th style={{ textAlign: "right" }}>Caps/minute</th>
                <th style={{ textAlign: "right" }}>Raw Material</th>
                <th style={{ textAlign: "right" }}>Cap wt (g)</th>
                <th style={{ textAlign: "right" }}>EB Consumption</th>
                <th style={{ textAlign: "right" }}>Labour Costs</th>
                <th style={{ textAlign: "right" }}>Transport</th>
                <th style={{ textAlign: "right" }}>Packaging</th>
                <th style={{ textAlign: "right" }}>EB Fixed Cost</th>
                <th style={{ textAlign: "right" }}>Production Cost</th>
                <th style={{ textAlign: "right" }}>Selling Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td>{h.time}</td>
                  <td>{h.capType}</td>
                  <td style={{ textAlign: "right" }}>{h.capsPerMin}</td>
                  <td style={{ textAlign: "right" }}>₹{h.rmCost}</td>
                  <td style={{ textAlign: "right" }}>{h.capWeight} g</td>
                  <td style={{ textAlign: "right" }}>₹{h.electricity}</td>
                  <td style={{ textAlign: "right" }}>₹{h.labour}</td>
                  <td style={{ textAlign: "right" }}>₹{h.transport}</td>
                  <td style={{ textAlign: "right" }}>₹{h.packaging}</td>
                  <td style={{ textAlign: "right" }}>₹{h.eb}</td>
                  <td style={{ textAlign: "right" }}>₹{h.totalCost}</td>
                  <td style={{ textAlign: "right" }}>₹{h.sellingPrice}</td>
                  <td style={{ textAlign: "center" }}><button className="btn small" onClick={() => saveEntryAsTxt(h)}>Save</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
