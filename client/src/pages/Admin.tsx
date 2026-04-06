import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { BarChart2, TrendingDown, DollarSign, Users, Activity, ChevronRight, ArrowDownRight } from "lucide-react";

type Tab = "dashboard" | "funnel" | "dropoff" | "revenue" | "leads";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <Activity size={14} /> },
  { id: "funnel", label: "Funil", icon: <ChevronRight size={14} /> },
  { id: "dropoff", label: "Drop-off", icon: <ArrowDownRight size={14} /> },
  { id: "revenue", label: "Receita", icon: <DollarSign size={14} /> },
  { id: "leads", label: "Leads", icon: <Users size={14} /> },
];

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`bg-zinc-100 animate-pulse rounded-lg ${className}`} />;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col gap-1">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-zinc-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-zinc-400">{sub}</p>}
    </div>
  );
}

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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Área Restrita</p>
        <h2 className="text-2xl font-black text-zinc-900 mb-6">Acesso Necessário</h2>
        <a href={getLoginUrl()} className="bg-zinc-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors">
          Fazer Login
        </a>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl">🔒</span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 mb-1">Acesso Negado</h2>
          <p className="text-sm text-zinc-500">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center">
              <BarChart2 size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-zinc-900">Desbloqueio Metabólico</span>
            <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">Admin</span>
          </div>
          <span className="text-xs text-zinc-400">{user.name}</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-zinc-200 rounded-xl p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── DASHBOARD ─── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {stats.isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28" />)}
              </div>
            ) : stats.data ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatCard label="Total de Sessões" value={String(stats.data.totalSessions)} />
                  <StatCard label="Completaram o Quiz" value={String(stats.data.completedSessions)} />
                  <StatCard label="Converteram" value={String(stats.data.convertedSessions)} />
                  <StatCard label="Taxa de Conclusão" value={`${stats.data.completionRate}%`} sub="meta: 65%" />
                  <StatCard label="Taxa de Conversão" value={`${stats.data.conversionRate}%`} sub="meta: 3%" />
                  <StatCard label="Receita Total" value={`$${(stats.data.totalRevenue / 100).toFixed(2)}`} sub="USD" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Benchmarks */}
                  <div className="bg-white border border-zinc-200 rounded-2xl p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-5">Benchmarks</p>
                    <div className="space-y-5">
                      {[
                        { label: "Conclusão do Quiz", current: stats.data.completionRate, benchmark: 65 },
                        { label: "Conversão Quiz → Venda", current: stats.data.conversionRate, benchmark: 3 },
                      ].map((b) => (
                        <div key={b.label}>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-zinc-600 font-medium">{b.label}</span>
                            <span className={`font-bold ${b.current >= b.benchmark ? "text-zinc-900" : "text-zinc-400"}`}>
                              {b.current}% {b.current >= b.benchmark ? "↑" : "↓"} meta {b.benchmark}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${b.current >= b.benchmark ? "bg-zinc-900" : "bg-zinc-300"}`}
                              style={{ width: `${Math.min(b.current, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leads por País */}
                  <div className="bg-white border border-zinc-200 rounded-2xl p-6">
                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-5">Leads por País</p>
                    {countryData.isLoading ? (
                      <div className="space-y-2">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6" />)}</div>
                    ) : countryData.data && countryData.data.length > 0 ? (
                      <div className="space-y-3">
                        {countryData.data.slice(0, 7).map((row) => {
                          const max = countryData.data![0].count || 1;
                          const pct = Math.round((row.count / max) * 100);
                          return (
                            <div key={row.country} className="flex items-center gap-3">
                              <span className="text-xs text-zinc-500 w-24 truncate">{row.country || "Desconhecido"}</span>
                              <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${Math.max(pct, 4)}%` }} />
                              </div>
                              <span className="text-xs font-bold text-zinc-900 w-6 text-right">{row.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-400 text-center py-6">Sem dados ainda.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-zinc-400 text-sm">Aguardando as primeiras sessões.</div>
            )}
          </div>
        )}

        {/* ─── FUNNEL ─── */}
        {activeTab === "funnel" && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">Funil de Conversão</p>
            {funnelData.isLoading ? (
              <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : funnelData.data ? (
              <div className="space-y-3">
                {funnelData.data.map((step, idx) => {
                  const maxVal = funnelData.data![0].value || 1;
                  const pct = Math.round((step.value / maxVal) * 100);
                  const convRate = idx > 0 ? Math.round((step.value / (funnelData.data![idx - 1].value || 1)) * 100) : 100;
                  return (
                    <div key={step.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-zinc-700">{step.label}</span>
                        <div className="flex items-center gap-3">
                          {idx > 0 && (
                            <span className={`text-xs font-bold ${convRate >= 10 ? "text-zinc-900" : "text-zinc-400"}`}>
                              {convRate}%
                            </span>
                          )}
                          <span className="text-xs font-black text-zinc-900">{step.value}</span>
                        </div>
                      </div>
                      <div className="h-8 bg-zinc-100 rounded-lg overflow-hidden">
                        <div
                          className="h-full rounded-lg flex items-center pl-3 transition-all duration-700 bg-zinc-900"
                          style={{ width: `${Math.max(pct, 5)}%`, opacity: 1 - idx * 0.12 }}
                        >
                          <span className="text-white text-xs font-bold">{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-400 text-sm">Sem dados de funil ainda.</div>
            )}
          </div>
        )}

        {/* ─── DROP-OFF ─── */}
        {activeTab === "dropoff" && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Drop-off por Pergunta</p>
              <p className="text-xs text-zinc-400 mt-1">Identifique onde os usuários abandonam o quiz.</p>
            </div>
            {dropoffData.isLoading ? (
              <div className="space-y-3">{[...Array(10)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
            ) : dropoffData.data && dropoffData.data.length > 0 ? (
              <div className="space-y-3">
                {dropoffData.data.map((item, idx) => {
                  const max = dropoffData.data![0].reached || 1;
                  const pct = Math.round((item.reached / max) * 100);
                  const dropPct = idx > 0
                    ? Math.round(((dropoffData.data![idx - 1].reached - item.reached) / (dropoffData.data![idx - 1].reached || 1)) * 100)
                    : 0;
                  const isProblematic = dropPct > 15;
                  return (
                    <div key={item.question} className={`p-3 rounded-xl border ${isProblematic ? "border-zinc-300 bg-zinc-50" : "border-zinc-100"}`}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-zinc-700">{item.question}</span>
                        <div className="flex items-center gap-2">
                          {idx > 0 && dropPct > 0 && (
                            <span className={`text-xs font-bold ${isProblematic ? "text-zinc-900" : "text-zinc-400"}`}>
                              {isProblematic ? "⚠ " : ""}-{dropPct}%
                            </span>
                          )}
                          <span className="text-xs font-black text-zinc-900">{item.reached}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-zinc-900 transition-all duration-700"
                          style={{ width: `${Math.max(pct, 3)}%`, opacity: pct > 70 ? 1 : pct > 40 ? 0.6 : 0.3 }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-2 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                  <p className="text-xs text-zinc-500">
                    <strong className="text-zinc-900">Dica:</strong> Perguntas com drop-off acima de 15% precisam de revisão. Simplifique o texto ou remova opções que geram fricção.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-400 text-sm">Sem dados de drop-off ainda.</div>
            )}
          </div>
        )}

        {/* ─── REVENUE ─── */}
        {activeTab === "revenue" && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">Receita por Tipo de Oferta</p>
            {revenueData.isLoading ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
            ) : revenueData.data && revenueData.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {revenueData.data.map((row) => (
                    <div key={row.type} className="border border-zinc-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-zinc-500">{row.label}</span>
                        <span className="text-xs text-zinc-400">{row.count} vendas</span>
                      </div>
                      <p className="text-2xl font-black text-zinc-900">${row.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-zinc-100 pt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Receita Total</p>
                    <p className="text-3xl font-black text-zinc-900 mt-1">
                      ${revenueData.data.reduce((acc, r) => acc + r.total, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">AOV</p>
                    <p className="text-3xl font-black text-zinc-900 mt-1">
                      ${(revenueData.data.reduce((acc, r) => acc + r.total, 0) / Math.max(revenueData.data.find(r => r.type === "main_offer")?.count || 1, 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-zinc-400 text-sm">Sem dados de receita ainda.</div>
            )}
          </div>
        )}

        {/* ─── LEADS ─── */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-4">
              <div className="flex flex-wrap gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">País</label>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="">Todos</option>
                    {countryData.data?.map(r => (
                      <option key={r.country} value={r.country || ""}>{r.country || "Desconhecido"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">De</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Até</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900" />
                </div>
                {(countryFilter || dateFrom || dateTo) && (
                  <button onClick={() => { setCountryFilter(""); setDateFrom(""); setDateTo(""); }}
                    className="text-xs text-zinc-400 hover:text-zinc-900 font-semibold transition-colors">
                    Limpar
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Leads Capturados</p>
                <span className="text-xs font-bold text-zinc-900">{leads.data?.length || 0}</span>
              </div>
              {leads.isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : leads.data && leads.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-zinc-100">
                      <tr>
                        {["Nome", "Email", "País", "Status", "Fonte", "Data"].map((h) => (
                          <th key={h} className="px-5 py-3 text-left font-semibold text-zinc-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {leads.data.map((lead) => (
                        <tr key={lead.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-5 py-3 font-semibold text-zinc-900">{lead.name || "—"}</td>
                          <td className="px-5 py-3 text-zinc-500">{lead.email || "—"}</td>
                          <td className="px-5 py-3 text-zinc-500">{lead.country || "—"}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-xs ${
                              lead.status === "converted" ? "bg-zinc-900 text-white" :
                              lead.status === "completed" ? "bg-zinc-100 text-zinc-700" :
                              "bg-zinc-50 text-zinc-400"
                            }`}>
                              {lead.status === "converted" ? "Convertido" :
                               lead.status === "completed" ? "Quiz OK" : "Iniciado"}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-zinc-400">{lead.utmSource || "direto"}</td>
                          <td className="px-5 py-3 text-zinc-400">
                            {new Date(lead.createdAt).toLocaleDateString("es-MX")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-xs text-zinc-400">Nenhum lead encontrado.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
