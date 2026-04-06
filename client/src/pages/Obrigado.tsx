export default function Obrigado() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          ¡Bienvenida a tu transformación!
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Tu pedido fue confirmado con éxito. En los próximos minutos recibirás un correo con el acceso a todo el material. Revisa también tu carpeta de spam.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-emerald-800 mb-2">¿Qué hacer ahora?</h3>
          <ol className="text-left text-emerald-700 text-sm space-y-2">
            <li><strong>1.</strong> Revisa tu correo electrónico (también el spam)</li>
            <li><strong>2.</strong> Descarga la Guía Maestra del Desbloqueo de 3 Minutos</li>
            <li><strong>3.</strong> Aplica el protocolo mañana antes del desayuno</li>
            <li><strong>4.</strong> Observa los cambios en los primeros 7 días</li>
          </ol>
        </div>
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo_desbloqueio_metabolico-XXWBHTmoyhnmkSeSUASCTv.webp"
          alt="Desbloqueio Metabólico"
          className="h-8 object-contain mx-auto opacity-50"
        />
      </div>
    </div>
  );
}
