import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const COLORS = ["#1A6B3C", "#2E8B57", "#4CAF7D", "#81C784", "#A5D6A7"];

type Tab = "dashboard" | "funnel" | "dropoff" | "revenue" | "leads";

export default function Admin() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [countryFilter, setCountryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const isAdmin = user?.role === "admin";

  const stats = trpc.admin.getStats.useQuery(undefined, { enabled: isAdmin });
  const funnelData = trpc.admin.getFunnelData.useQuery(undefined, { enabled: isAdmin && activeTab === "funnel" });
  const dropoffData = trpc.admin.getDropoffStats.useQuery(undefined, { enabled: isAdmin && activeTab === "dropoff" });
  const revenueData = trpc.admin.getRevenueByType.useQuery(undefined, { enabled: isAdmin && activeTab === "revenue" });
  const countryData = trpc.admin.getStatsByCountry.useQuery(undefined, { enabled: isAdmin });
  const leads = trpc.admin.getLeadsFiltered.useQuery(
    { limit: 100, offset: 0, country: countryFilter || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined },
    { enabled: isAdmin && activeTab === "leads" }
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Área Restrita</h2>
        <p className="text-gray-600 mb-6">Faça login para acessar o painel admin.</p>
        <a href={getLoginUrl()} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
          Fazer Login
        </a>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-5xl mb-4 block">🔒</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
          <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "funnel", label: "🔽 Funil" },
    { id: "dropoff", label: "📉 Drop-off" },
    { id: "revenue", label: "💰 Receita" },
    { id: "leads", label: "👥 Leads" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo_desbloqueio_metabolico-XXWBHTmoyhnmkSeSUASCTv.webp"
              alt="Logo"
              className="h-7 object-contain"
            />
            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Admin</span>
          </div>
          <span className="text-sm text-gray-500">Olá, {user.name}</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-1 border border-gray-200 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── DASHBOARD TAB ─── */}
        {activeTab === "dashboard" && (
          <div>
            {stats.isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded mb-3 w-2/3" />
                    <div className="h-8 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : stats.data ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Total de Sessões", value: stats.data.totalSessions, icon: "👁️", color: "text-gray-900" },
                    { label: "Completaram o Quiz", value: stats.data.completedSessions, icon: "✅", color: "text-emerald-600" },
                    { label: "Converteram", value: stats.data.convertedSessions, icon: "💰", color: "text-orange-600" },
                    { label: "Taxa de Conclusão", value: `${stats.data.completionRate}%`, icon: "📈", color: "text-blue-600" },
                    { label: "Taxa de Conversão", value: `${stats.data.conversionRate}%`, icon: "🎯", color: "text-purple-600" },
                    { label: "Receita Total", value: `$${(stats.data.totalRevenue / 100).toFixed(2)}`, icon: "💵", color: "text-green-600" },
                  ].map((metric) => (
                    <div key={metric.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{metric.icon}</span>
                        <p className="text-xs text-gray-500 font-medium">{metric.label}</p>
                      </div>
                      <p className={`text-3xl font-extrabold ${metric.color}`}>{metric.value}</p>
                    </div>
                  ))}
                </div>

                {/* Benchmarks */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Benchmarks do Setor</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Taxa de Conclusão do Quiz", current: stats.data.completionRate, benchmark: 65, unit: "%" },
                        { label: "Taxa de Conversão (Quiz → Venda)", current: stats.data.conversionRate, benchmark: 3, unit: "%" },
                      ].map((b) => (
                        <div key={b.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{b.label}</span>
                            <span className={`font-bold ${b.current >= b.benchmark ? "text-emerald-600" : "text-orange-500"}`}>
                              {b.current}{b.unit} {b.current >= b.benchmark ? "✓" : "↓"}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${b.current >= b.benchmark ? "bg-emerald-500" : "bg-orange-400"}`}
                              style={{ width: `${Math.min(b.current, 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Benchmark: {b.benchmark}{b.unit}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leads por País */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Leads por País</h3>
                    {countryData.isLoading ? (
                      <div className="space-y-2">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />)}
                      </div>
                    ) : countryData.data && countryData.data.length > 0 ? (
                      <div className="space-y-2">
                        {countryData.data.slice(0, 8).map((row, idx) => {
                          const max = countryData.data![0].count || 1;
                          const pct = Math.round((row.count / max) * 100);
                          return (
                            <div key={row.country} className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 w-28 truncate">{row.country || "Desconhecido"}</span>
                              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full flex items-center pl-2"
                                  style={{ width: `${Math.max(pct, 8)}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                                >
                                  <span className="text-white text-xs font-bold">{row.count}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-4">Sem dados de país ainda.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">Sem dados ainda. Aguardando as primeiras sessões.</div>
            )}
          </div>
        )}

        {/* ─── FUNNEL TAB ─── */}
        {activeTab === "funnel" && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Funil de Conversão</h3>
            {funnelData.isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
              </div>
            ) : funnelData.data ? (
              <div className="space-y-3">
                {funnelData.data.map((step, idx) => {
                  const maxVal = funnelData.data![0].value || 1;
                  const pct = Math.round((step.value / maxVal) * 100);
                  const convRate = idx > 0 ? Math.round((step.value / (funnelData.data![idx - 1].value || 1)) * 100) : 100;
                  return (
                    <div key={step.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-700">{step.label}</span>
                        <div className="flex items-center gap-3">
                          {idx > 0 && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${convRate >= 10 ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                              {convRate}% conv.
                            </span>
                          )}
                          <span className="text-sm font-bold text-gray-900">{step.value}</span>
                        </div>
                      </div>
                      <div className="h-10 bg-gray-100 rounded-xl overflow-hidden">
                        <div
                          className="h-full rounded-xl flex items-center pl-3 transition-all duration-700"
                          style={{ width: `${Math.max(pct, 5)}%`, backgroundColor: COLORS[idx] || COLORS[4] }}
                        >
                          <span className="text-white text-xs font-bold">{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">Sem dados de funil ainda.</div>
            )}
          </div>
        )}

        {/* ─── DROP-OFF TAB ─── */}
        {activeTab === "dropoff" && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Drop-off por Pergunta</h3>
              <p className="text-sm text-gray-500 mt-1">Quantos usuários chegaram em cada pergunta do quiz. Identifique onde estão abandonando.</p>
            </div>
            {dropoffData.isLoading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : dropoffData.data && dropoffData.data.length > 0 ? (
              <div className="space-y-3">
                {dropoffData.data.map((item, idx) => {
                  const max = dropoffData.data![0].reached || 1;
                  const pct = Math.round((item.reached / max) * 100);
                  const dropPct = idx > 0
                    ? Math.round(((dropoffData.data![idx - 1].reached - item.reached) / (dropoffData.data![idx - 1].reached || 1)) * 100)
                    : 0;
                  return (
                    <div key={item.question}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.question}</span>
                        <div className="flex items-center gap-2">
                          {idx > 0 && dropPct > 0 && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${dropPct > 15 ? "bg-red-100 text-red-700" : dropPct > 5 ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>
                              -{dropPct}% saíram
                            </span>
                          )}
                          <span className="text-sm font-bold text-gray-900">{item.reached}</span>
                        </div>
                      </div>
                      <div className="h-8 bg-gray-100 rounded-xl overflow-hidden">
                        <div
                          className="h-full rounded-xl flex items-center pl-3 transition-all duration-700"
                          style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: pct > 70 ? "#1A6B3C" : pct > 40 ? "#F97316" : "#EF4444" }}
                        >
                          <span className="text-white text-xs font-bold">{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-amber-800 font-medium">
                    💡 <strong>Dica:</strong> Perguntas com drop-off acima de 15% precisam de revisão. Considere simplificar o texto ou remover opções que geram fricção.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">Sem dados de drop-off ainda.</div>
            )}
          </div>
        )}

        {/* ─── REVENUE TAB ─── */}
        {activeTab === "revenue" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Receita por Tipo de Oferta</h3>
              {revenueData.isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
              ) : revenueData.data && revenueData.data.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {revenueData.data.map((row, idx) => (
                      <div key={row.type} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-700">{row.label}</span>
                          <span className="text-xs text-gray-400">{row.count} vendas</span>
                        </div>
                        <p className="text-2xl font-extrabold" style={{ color: COLORS[idx % COLORS.length] }}>
                          ${row.total.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Receita Total</span>
                      <span className="text-2xl font-extrabold text-emerald-600">
                        ${revenueData.data.reduce((acc, r) => acc + r.total, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-500">AOV (Ticket Médio)</span>
                      <span className="text-sm font-bold text-gray-700">
                        ${revenueData.data.length > 0
                          ? (revenueData.data.reduce((acc, r) => acc + r.total, 0) / Math.max(revenueData.data.find(r => r.type === "main_offer")?.count || 1, 1)).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">Sem dados de receita ainda.</div>
              )}
            </div>
          </div>
        )}

        {/* ─── LEADS TAB ─── */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">País</label>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Todos os países</option>
                    {countryData.data?.map(r => (
                      <option key={r.country} value={r.country || ""}>{r.country || "Desconhecido"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">De</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Até</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                {(countryFilter || dateFrom || dateTo) && (
                  <button
                    onClick={() => { setCountryFilter(""); setDateFrom(""); setDateTo(""); }}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Leads Capturados</h3>
                <span className="text-sm text-gray-500">{leads.data?.length || 0} registros</span>
              </div>
              {leads.isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
                </div>
              ) : leads.data && leads.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {["Nome", "Email", "País", "Status", "Fonte", "Data"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {leads.data.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">{lead.name || "—"}</td>
                          <td className="px-4 py-3 text-gray-600">{lead.email || "—"}</td>
                          <td className="px-4 py-3 text-gray-600">{lead.country || "—"}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              lead.status === "converted" ? "bg-emerald-100 text-emerald-700" :
                              lead.status === "completed" ? "bg-blue-100 text-blue-700" :
                              "bg-gray-100 text-gray-600"
                            }`}>
                              {lead.status === "converted" ? "✓ Convertido" :
                               lead.status === "completed" ? "Quiz OK" : "Iniciado"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{lead.utmSource || "direto"}</td>
                          <td className="px-4 py-3 text-gray-500">
                            {new Date(lead.createdAt).toLocaleDateString("es-MX")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <span className="text-4xl block mb-3">📭</span>
                  Nenhum lead encontrado com os filtros atuais.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
