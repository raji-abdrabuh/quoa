'use client'
import { useState, useRef } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import Cairo from './fonts/static/Cairo-Regular.ttf';
Font.register({
  family: "Cairo",
  fonts: [
    { src: Cairo, fontWeight: 400 },
    { src: Cairo, fontWeight: 700 },
  ],
});

// ─── PDF Styles ───────────────────────────────────────────────────────────────
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Cairo",
    fontSize: 10,
    color: "#1a1a2e",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingBottom: 20,
    borderBottom: "2px solid #1a1a2e",
  },
  companyBlock: { flex: 1 },
  companyName: { fontSize: 20, fontFamily: "Cairo", color: "#1a1a2e", marginBottom: 4 },
  taxId: { fontSize: 9, color: "#555" },
  metaBlock: { alignItems: "flex-end" },
  quoteTitle: { fontSize: 16, fontFamily: "Cairo", color: "#c9a84c", marginBottom: 6 },
  metaRow: { flexDirection: "row", gap: 4, marginBottom: 2 },
  metaLabel: { fontSize: 9, color: "#888" },
  metaValue: { fontSize: 9, fontFamily: "Cairo" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    color: "#fff",
    padding: "8 6",
    borderRadius: 4,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    padding: "7 6",
    borderBottom: "0.5px solid #e5e5e5",
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: "7 6",
    backgroundColor: "#f9f7f1",
    borderBottom: "0.5px solid #e5e5e5",
  },
  colName: { flex: 3, fontSize: 9 ,textAlign:"right"},
  colUnit: { flex: 1.5, fontSize: 9, textAlign: "center" },
  colQty: { flex: 1, fontSize: 9, textAlign: "center" },
  colPrice: { flex: 1.5, fontSize: 9, textAlign: "center" },
  colSub: { flex: 1.5, fontSize: 9, textAlign: "center" },
  colVat: { flex: 1.5, fontSize: 9, textAlign: "center" },
  colTotal: { flex: 1.5, fontSize: 9, textAlign: "center" },
  colNameH: { flex: 3, fontSize: 9, color: "#fff", fontFamily: "Cairo", textAlign:"right",paddingRight:"10px"},
  colUnitH: { flex: 1.5, fontSize: 9, color: "#fff", textAlign: "center", fontFamily: "Cairo" },
  colQtyH: { flex: 1, fontSize: 9, color: "#fff", textAlign: "center", fontFamily: "Cairo" },
  colPriceH: { flex: 1.5, fontSize: 9, color: "#fff", textAlign: "center", fontFamily: "Cairo" },
  colSubH: { flex: 1.5, fontSize: 9, color: "#fff", textAlign: "center", fontFamily: "Cairo" },
  colVatH: { flex: 1.5, fontSize: 9, color: "#fff", textAlign: "center", fontFamily: "Cairo" },
  colTotalH: { flex: 1.5, fontSize: 9, color: "#fff", textAlign: "center", fontFamily: "Cairo" },
  summarySection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
  },
  summaryBox: {
    width: 220,
    border: "1px solid #e5e5e5",
    borderRadius: 6,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "7 12",
    borderBottom: "0.5px solid #e5e5e5",
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "9 12",
    backgroundColor: "#1a1a2e",
  },
  summaryLabel: { fontSize: 9, color: "#555" },
  summaryValue: { fontSize: 9, fontFamily: "Cairo" },
  summaryTotalLabel: { fontSize: 10, color: "#fff", fontFamily: "Cairo" },
  summaryTotalValue: { fontSize: 10, color: "#c9a84c", fontFamily: "Cairo" },
  footer: { marginTop: 40, paddingTop: 12, borderTop: "0.5px solid #ddd", textAlign: "center", fontSize: 8, color: "#aaa" },
});

// ─── PDF Document ─────────────────────────────────────────────────────────────
function QuotePDF({ company, taxId, date, quoteNumber, items, subtotal, totalVat, grandTotal }) {
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header */}
        <View style={pdfStyles.header}>
          <View style={pdfStyles.companyBlock}>
            <Text style={pdfStyles.companyName}>{company || "اسم الشركة"}</Text>
            <Text style={pdfStyles.taxId}>الرقم الضريبي: {taxId || "—"}</Text>
          </View>
          <View style={pdfStyles.metaBlock}>
          
            <View style={pdfStyles.metaRow}>
              <Text style={pdfStyles.metaLabel}>التاريخ:</Text>
              <Text style={pdfStyles.metaValue}>{date || "—"}</Text>
            </View>

            <View style={pdfStyles.metaRow}>
              <Text style={pdfStyles.metaLabel}>رقم العرض:</Text>
              <Text style={pdfStyles.metaValue}>{quoteNumber || "—"}</Text>
            </View>
            <Text style={pdfStyles.quoteTitle}>عرض سعر</Text>
          </View>
        </View>

        {/* Table */}
        <View style={pdfStyles.tableHeader}>
          <Text style={pdfStyles.colTotalH}>الإجمالي</Text>
          <Text style={pdfStyles.colVatH}>ضريبة %15</Text>
          <Text style={pdfStyles.colSubH}>الإجمالي الفرعي</Text>
          <Text style={pdfStyles.colPriceH}>السعر</Text>
          <Text style={pdfStyles.colQtyH}>الكمية</Text>
          <Text style={pdfStyles.colUnitH}>الوحدة</Text>
          <Text style={pdfStyles.colNameH}>المنتج</Text>
          <Text style={{width:"20px",textAlign:"center",paddingLeft:"5px"}}>#</Text>
        </View>

        {items.map((item, idx) => (
          <View key={idx} style={idx % 2 === 0 ? pdfStyles.tableRow : pdfStyles.tableRowAlt}>
            <Text style={pdfStyles.colTotal}>{Number(item.total).toFixed(2)}</Text>
            <Text style={pdfStyles.colVat}>{Number(item.vat).toFixed(2)}</Text>
            <Text style={pdfStyles.colSub}>{Number(item.subtotal).toFixed(2)}</Text>
            <Text style={pdfStyles.colPrice}>{Number(item.price).toFixed(2)}</Text>
            <Text style={pdfStyles.colQty}>{item.qty}</Text>
            <Text style={pdfStyles.colUnit}>{item.unit}</Text>
            <Text style={pdfStyles.colName}>{item.name}</Text>
            <Text style={{width:"20px",textAlign:"center",paddingLeft:"5px"}}>{idx+1}</Text>
          </View>
        ))}

        {/* Summary */}
        <View style={pdfStyles.summarySection}>
          <View style={pdfStyles.summaryBox}>
            <View style={pdfStyles.summaryRow}>
              <Text style={pdfStyles.summaryLabel}>الإجمالي الفرعي</Text>
              <Text style={pdfStyles.summaryValue}>{subtotal.toFixed(2)} ر.س</Text>
            </View>
            <View style={pdfStyles.summaryRow}>
              <Text style={pdfStyles.summaryLabel}>ضريبة القيمة المضافة %15</Text>
              <Text style={pdfStyles.summaryValue}>{totalVat.toFixed(2)} ر.س</Text>
            </View>
            <View style={pdfStyles.summaryTotal}>
              <Text style={pdfStyles.summaryTotalLabel}>الإجمالي الكلي</Text>
              <Text style={pdfStyles.summaryTotalValue}>{grandTotal.toFixed(2)} ر.س</Text>
            </View>
          </View>
        </View>

        <Text style={pdfStyles.footer}>عرض السعر غير ملزم وقد تتغير الاسعار والكميات خلال اليوم</Text>
      </Page>
    </Document>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const emptyItem = () => ({ name: "", unit: "كرتون", qty: "", price: "", subtotal: 0, vat: 0, total: 0 });

export default function QuotationForm() {
  const [company, setCompany] = useState("");
  const [taxId, setTaxId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [quoteNumber, setQuoteNumber] = useState("QT-001");
  const [items, setItems] = useState([emptyItem(), emptyItem()]);

  const VAT_RATE = 0.15;

  const calcItem = (item) => {
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    const subtotal = qty * price;
    const vat = subtotal * VAT_RATE;
    const total = subtotal + vat;
    return { ...item, subtotal, vat, total };
  };

  const updateItem = (idx, field, value) => {
    setItems(prev => {
      const next = [...prev];
      next[idx] = calcItem({ ...next[idx], [field]: value });
      return next;
    });
  };

  const addItem = () => setItems(prev => [...prev, emptyItem()]);
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const totalVat = items.reduce((s, i) => s + i.vat, 0);
  const grandTotal = items.reduce((s, i) => s + i.total, 0);
  let newdata=[];
  const inputCls = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: "1.5px solid #d4c89a",
    background: "#fffdf4",
    fontSize: 14,
    color: "#1a1a2e",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "'Tajawal', sans-serif",
  };

  const labelCls = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#7a6930",
    marginBottom: 5,
    letterSpacing: "0.03em",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; }
        body { direction: rtl; }
        .qf-root { font-family: 'Tajawal', sans-serif; direction: rtl; max-width: 1100px; margin: 0 auto; padding: 24px 16px; }
        .qf-card { background: #fff; border: 1.5px solid #e8dfc0; border-radius: 14px; padding: 28px; margin-bottom: 20px; }
        .qf-section-title { font-size: 13px; font-weight: 700; color: #7a6930; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 1.5px solid #f0e8cc; display: flex; align-items: center; gap: 8px; }
        .qf-section-title::before { content: ''; display: inline-block; width: 4px; height: 16px; background: #c9a84c; border-radius: 3px; }
        .qf-grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .qf-inp:focus { border-color: #c9a84c !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.12); }
        .qf-inp:hover { border-color: #c9a84c !important; }
        .qf-table-wrap { overflow-x: auto; }
        .qf-table { width: 100%; border-collapse: collapse; min-width: 700px; }
        .qf-table th { background: #1a1a2e; color: #f5edd6; font-size: 12px; font-weight: 600; padding: 10px 8px; text-align: right; white-space: nowrap; }
        .qf-table th:first-child { border-radius: 0 8px 8px 0; }
        .qf-table th:last-child { border-radius: 8px 0 0 8px; }
        .qf-table td { padding: 7px 6px; vertical-align: middle; border-bottom: 1px solid #f0e8cc; }
        .qf-table tr:nth-child(even) td { background: #fffdf4; }
        .qf-table tr:hover td { background: #fef9ec; }
        .qf-td-inp { width: 100%; padding: 7px 9px; border-radius: 7px; border: 1.5px solid #e8dfc0; background: transparent; font-size: 13px; color: #1a1a2e; font-family: 'Tajawal', sans-serif; outline: none; transition: border-color .2s; }
        .qf-td-inp:focus { border-color: #c9a84c; box-shadow: 0 0 0 3px rgba(201,168,76,.1); }
        .qf-td-inp:hover { border-color: #c9a84c; }
        .qf-badge { font-size: 12px; font-weight: 600; color: #6b5a1e; background: #fef3c7; border-radius: 6px; padding: 4px 9px; text-align: center; display: block; white-space: nowrap; }
        .qf-add-btn { margin-top: 14px; padding: 8px 18px; background: transparent; border: 1.5px dashed #c9a84c; color: #7a6930; border-radius: 8px; cursor: pointer; font-family: 'Tajawal', sans-serif; font-size: 14px; transition: all .2s; }
        .qf-add-btn:hover { background: #fef9ec; border-color: #a07d22; }
        .qf-remove-btn { background: none; border: none; color: #d9534f; cursor: pointer; font-size: 18px; padding: 0 6px; line-height: 1; opacity: .6; transition: opacity .2s; }
        .qf-remove-btn:hover { opacity: 1; }
        .qf-bottom { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-start; justify-content: space-between; }
        .qf-summary { background: #1a1a2e; border-radius: 12px; padding: 20px 24px; min-width: 280px; flex: 0 0 auto; }
        .qf-sum-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,.08); }
        .qf-sum-row:last-of-type { border-bottom: none; }
        .qf-sum-label { font-size: 13px; color: #a89a6a; }
        .qf-sum-value { font-size: 13px; font-weight: 700; color: #f5edd6; }
        .qf-sum-total { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1.5px solid #c9a84c; }
        .qf-sum-total-label { font-size: 15px; font-weight: 700; color: #fff; }
        .qf-sum-total-value { font-size: 18px; font-weight: 700; color: #c9a84c; }
        .qf-actions { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; }
        .qf-pdf-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 28px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: #f5edd6; border: none; border-radius: 10px; font-family: 'Tajawal', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all .2s; box-shadow: 0 4px 12px rgba(26,26,46,.25); }
        .qf-pdf-btn:hover { background: linear-gradient(135deg, #c9a84c 0%, #a07d22 100%); color: #1a1a2e; transform: translateY(-1px); box-shadow: 0 6px 18px rgba(201,168,76,.3); }
        .qf-logo { font-size: 22px; font-weight: 700; color: #1a1a2e; letter-spacing: -.01em; }
        .qf-logo span { color: #c9a84c; }
        .qf-header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 2px solid #1a1a2e; }
        .qf-header-meta { text-align: left; font-size: 13px; color: #888; }
        select.qf-td-inp { appearance: none; -webkit-appearance: none; cursor: pointer; }
        @media (max-width: 640px) {
          .qf-card { padding: 16px; }
          .qf-bottom { flex-direction: column; }
          .qf-summary { width: 100%; min-width: unset; }
          .qf-actions { width: 100%; }
          .qf-pdf-btn { width: 100%; }
        }
      `}</style>

      <div className="qf-root">
        {/* Header Bar */}
        <div className="qf-header-bar">
          <div className="qf-logo">عرض<span>سعر</span></div>
          <div className="qf-header-meta">نظام إدارة عروض الأسعار</div>
        </div>

        {/* ── Section 1: Company Info ── */}
        <div className="qf-card">
          <div className="qf-section-title">بيانات الشركة والعرض</div>
          <div className="qf-grid-4">
            <div>
              <label style={labelCls}>اسم الشركة</label>
              <input className="qf-inp" style={inputCls} placeholder="مثال: شركة الأفق للتقنية" value={company} onChange={e => setCompany(e.target.value)} />
            </div>
            <div>
              <label style={labelCls}>الرقم الضريبي</label>
              <input className="qf-inp" style={inputCls} placeholder="300XXXXXXXXX" value={taxId} onChange={e => setTaxId(e.target.value)} />
            </div>
            <div>
              <label style={labelCls}>تاريخ العرض</label>
              <input className="qf-inp" style={inputCls} type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div>
              <label style={labelCls}>رقم عرض السعر</label>
              <input className="qf-inp" style={inputCls} placeholder="QT-001" value={quoteNumber} onChange={e => setQuoteNumber(e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── Section 2: Items Table ── */}
        <div className="qf-card">
          <div className="qf-section-title">بنود عرض السعر</div>
          <div className="qf-table-wrap">
            <table className="qf-table">
              <thead>
                <tr>
                  <th style={{ width: 32 }}>#</th>
                  <th>اسم المنتج / الخدمة</th>
                  <th style={{ width: 110 }}>الوحدة</th>
                  <th style={{ width: 90 }}>الكمية</th>
                  <th style={{ width: 110 }}>السعر</th>
                  <th style={{ width: 120 }}>الإجمالي الفرعي</th>
                  <th style={{ width: 110 }}>ضريبة 15%</th>
                  <th style={{ width: 120 }}>الإجمالي</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: "center", fontSize: 12, color: "#aaa", fontWeight: 600 }}>{idx + 1}</td>
                    <td>
                      <input  className="qf-td-inp" placeholder="أدخل اسم المنتج أو الخدمة" value={item.name} onChange={e => updateItem(idx, "name", e.target.value)} />
                    </td>
                    <td>
                      <select className="qf-td-inp" value={item.unit} onChange={e => updateItem(idx, "unit", e.target.value)}>
                        <option value="كرتون">كرتون</option>
                        <option value="حبة">حبة</option>
                        <option value="طن">طن</option>
                        <option value="لتر">لتر</option>
                        <option value="متر">متر</option>
                        <option value="خدمة">خدمة</option>
                      </select>
                    </td>
                    <td>
                      <input className="qf-td-inp" type="number" min="0" placeholder="0" value={item.qty} onChange={e => updateItem(idx, "qty", e.target.value)} style={{ textAlign: "center" }} required/>
                    </td>
                    <td>
                      <input className="qf-td-inp" type="number" min="0" step="0.01" placeholder="0.00" value={item.price} onChange={e => updateItem(idx, "price", e.target.value)} style={{ textAlign: "left" }} required/>
                    </td>
                    <td><span className="qf-badge">{item.subtotal.toFixed(2)} ر.س</span></td>
                    <td><span className="qf-badge" style={{ background: "#fff3cd", color: "#856404" }}>{item.vat.toFixed(2)} ر.س</span></td>
                    <td><span className="qf-badge" style={{ background: "#d4edda", color: "#155724" }}>{item.total.toFixed(2)} ر.س</span></td>
                    <td>
                      {items.length > 1 && (
                        <button className="qf-remove-btn" onClick={() => removeItem(idx)} title="حذف البند">×</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="qf-add-btn" onClick={addItem}>+ إضافة بند جديد</button>
        </div>

        {/* ── Section 3: Actions & Summary ── */}
        <div className="qf-card">
          <div className="qf-section-title">الملخص والتصدير</div>
          <div className="qf-bottom">
            {/* Actions */}
            <div className="qf-actions">
              <div style={{ marginBottom: 14, padding: "12px 16px", background: "#f9f7f1", borderRadius: 10, border: "1px solid #e8dfc0", fontSize: 13, color: "#7a6930" }}>
                <strong>ملاحظة:</strong> يتضمن السعر ضريبة القيمة المضافة بنسبة 15% وفقاً للأنظمة المعمول بها في المملكة العربية السعودية.
              </div>
           

              <PDFDownloadLink key={JSON.stringify({ company, taxId, date, quoteNumber, items })} 
                document={
                  <QuotePDF
                    company={company}
                    taxId={taxId}
                    date={date}
                    quoteNumber={quoteNumber}
                    items={items}
                    subtotal={subtotal}
                    totalVat={totalVat}
                    grandTotal={grandTotal}
                  />
                }
                fileName={`عرض-سعر-${quoteNumber || "جديد"}.pdf`}
              >
                {({ loading }) => (
                  <button className="qf-pdf-btn" disabled={loading}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="18" x2="12" y2="12" />
                      <polyline points="9 15 12 18 15 15" />
                    </svg>
                    {loading ? "جاري التجهيز..." : "حفظ كملف PDF"}
                  </button>
                )}
              </PDFDownloadLink>
            </div>

            {/* Summary Box */}
            <div className="qf-summary">
              <div style={{ fontSize: 12, color: "#c9a84c", fontWeight: 700, letterSpacing: ".06em", marginBottom: 14, textTransform: "uppercase" }}>ملخص العرض</div>
              <div className="qf-sum-row">
                <span className="qf-sum-label">الإجمالي الفرعي</span>
                <span className="qf-sum-value">{subtotal.toFixed(2)} ر.س</span>
              </div>
              <div className="qf-sum-row">
                <span className="qf-sum-label">ضريبة القيمة المضافة (15%)</span>
                <span className="qf-sum-value">{totalVat.toFixed(2)} ر.س</span>
              </div>
              <div className="qf-sum-total">
                <span className="qf-sum-total-label">الإجمالي الكلي</span>
                <span className="qf-sum-total-value">{grandTotal.toFixed(2)} ر.س</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
