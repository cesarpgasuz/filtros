import { useState, useRef } from "react"


function App() {

  const [images, setImages] = useState([]);
  const canvasRef = useRef(null); // Referencia al canvas

  // Manejar la carga de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // Resetear la aplicación
  const resetApp = () => {
    setImages([]);
  };

  // Función para aplicar filtros usando canvas
  const applyFilterToCanvas = (image, filter) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = URL.createObjectURL(image);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Aplicar filtro antes de dibujar la imagen
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);

      // Ahora la imagen tiene el filtro aplicado en el canvas
      const filteredImage = canvas.toDataURL('image/png');
      return filteredImage;
    };
  };

  // Función para descargar la imagen filtrada
  const downloadFilteredImage = (image, filter, imageName) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.src = URL.createObjectURL(image);
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Aplicar el filtro y dibujar la imagen
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);

      // Descargar la imagen desde el canvas
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${imageName}_px.png`;
      link.click();
    };
  };

  // Filtro predefinido
  const filter = 'brightness(99%) contrast(120%) saturate(115%)';

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Image Filter App</h1>

      <input
        type="file"
        multiple
        accept="image/png"
        onChange={handleImageUpload}
        className="block mx-auto mb-4"
      />

      {/* Botón de reset */}
      <button
        onClick={resetApp}
        className="block mx-auto bg-red-500 text-white px-4 py-2 rounded mb-6"
      >
        Resetear
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => {
          const imageUrl = URL.createObjectURL(image);

          return (
            <div key={index} className="bg-white p-4 rounded shadow-md grid grid-cols-2 relative">

              <div className="h-44 w-full object-cover">
                <img src={imageUrl} alt={`original-${index}`} className="w-full mb-4" />
              </div>
              <div className="h-44 w-full objetc-cover">
              <img
                src={imageUrl}
                alt={`filtered-${index}`}
                className="w-full mb-4"
                style={{ filter }}
              />
              </div>


            
              

              <button
                onClick={() => downloadFilteredImage(image, filter, image.name.split('.')[0])}
                className="bg-blue-500 text-white px-4 py-2 rounded absolute bottom-0 right-0"
              >
                Descargar con filtro
              </button>
            </div>
          );
        })}
      </div>

      {/* Canvas oculto para aplicar el filtro y generar la imagen */}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}

export default App
