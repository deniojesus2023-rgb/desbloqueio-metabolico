import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList, Cell } from "recharts";

const COLORS = ["#1A6B3C", "#2E8B57", "#4CAF7D", "#81C784", "#A5D6A7"];

export default function Admin() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads" | "funnel">("dashboard");

  const stats = trpc.admin.getStats.useQuery(undefined, { enabled: user?.role === "admin" });
  const leads = trpc.admin.getLeads.useQuery({ limit: 50, offset: 0 }, { enabled: user?.role === "admin" && activeTab === "leads" });
  const funnelData = trpc.admin.getFunnelData.useQuery(undefined, { enabled: user?.role === "admin" && activeTab === "funnel" });

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
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-1 border border-gray-200 w-fit">
          {(["dashboard", "funnel", "leads"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${activeTab === tab ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
            >
              {tab === "dashboard" ? "📊 Dashboard" : tab === "funnel" ? "🔽 Funil" : "👥 Leads"}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
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

                {/* Benchmark */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">Benchmarks do Setor</h3>
                  <div className="space-y-3">
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
                        <p className="text-xs text-gray-400 mt-1">Benchmark do setor: {b.benchmark}{b.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">Sem dados ainda. Aguardando as primeiras sessões.</div>
            )}
          </div>
        )}

        {/* FUNNEL TAB */}
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
                          style={{
                            width: `${Math.max(pct, 5)}%`,
                            backgroundColor: COLORS[idx] || COLORS[4],
                          }}
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

        {/* LEADS TAB */}
        {activeTab === "leads" && (
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
                          {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <span className="text-4xl block mb-3">📭</span>
                Nenhum lead ainda. Compartilhe o quiz para começar!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
