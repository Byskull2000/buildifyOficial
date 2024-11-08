import { useParams, useNavigate, Link } from "react-router-dom"; // Cambié useHistory a useNavigate
import NavBar from "../components/simpleNavBar";
import { useState, useEffect } from "react";
import { MdLocationOn } from "react-icons/md";
import Mapa from "../components/Mapa";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../components/getCroppedImg";
import Modal from "react-modal";
Modal.setAppElement("#root");
import FormEliminacion from "../components/formEliminacion";
const Editar = () => {
  const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
  const { id_material } = useParams<{ id_material: string }>();
  const navigate = useNavigate(); // Cambié useHistory a useNavigate

  interface Ubicacion {
    lat: number;
    lng: number;
  }

  const [, setCoordenadasSeleccionadas] = useState<Ubicacion | null>(null);
  const [openMap, setOpenMap] = useState(false);
  const [UbicacionMaterial, setUbicacionMaterial] = useState("");
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [condicion, setCondicion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [unidad, setUnidad] = useState("");
  const [cantidad, setCantidad] = useState("");

  //Para las imagenes
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [images, setImages] = useState<string[]>([]);
  const [imagesPerCrop, setImagesPerCrop] = useState<File[]>([]);
  const [rotation, setRotation] = useState<number>(0);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const newImages: File[] = [];
    if (files) {
      files.forEach((file) => {
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
          newImages.push(file);
        } else {
          alert("Por favor, sube una imagen JPG o PNG.");
        }
      });
    }
    setImagesPerCrop(newImages);
  };

  useEffect(() => {
    if (imagesPerCrop.length > 0) {
      const file = imagesPerCrop[0];
      const reader = new FileReader();
      reader.onloadend = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setImage(e.target.result);
          setIsModalOpen(true); // Abre el modal al cargar la imagen
        }
      };
      reader.readAsDataURL(file);
    }
  }, [imagesPerCrop]);

  const handleUploadClick = () => {
    const fileInput = document.getElementById(
      "dropzone-file"
    ) as HTMLInputElement;
    fileInput.click(); // Simula un clic en el input de archivo
  };

  const onCropComplete = async (
    croppedArea: { x: number; y: number; width: number; height: number },
    croppedAreaPixels: { x: number; y: number; width: number; height: number }
  ) => {
    console.log("Cropped Area: ", croppedArea);
    if (image) {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage); // Guardar la imagen recortada para mostrarla
    }
  };

  const handleCrop = async () => {
    if (croppedImage) {
      try {
        setImages([...images, croppedImage]);
        imagesPerCrop.shift();
        setImagesPerCrop([...imagesPerCrop]);
      } catch (error) {
        console.error("Error recortando la imagen:", error);
      }
      setIsModalOpen(false);
    }
  };

  // Funcion para rotar la imagen
  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360); // Aumentar la rotacion en 90 grados
  };

  // Función para pre-poblar los datos del material
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${URL_BACKEND}/api/materiales/${id_material}`
        );
        if (!response.ok)
          throw new Error("Error al obtener los datos del material");

        const data = await response.json();
        const material = data.data;
        setTitulo(material.nombre_material);
        setPrecio(material.precio_material);
        setCategoria(material.id_tipo_material);
        setCondicion(material.estado_material);
        setDescripcion(material.descripcion_material);
        setUnidad(material.tipo_unidad_material);
        setCantidad(material.cantidad_material);
        setUbicacionMaterial(material.descripcion_direccion_material);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [id_material, URL_BACKEND]);

  // Función para manejar la actualización del material
  const handleSave = async () => {
    const updatedData = {
      nombre_material: titulo,
      precio_material: precio,
      id_tipo_material: categoria,
      estado_material: condicion,
      descripcion_material: descripcion,
      tipo_unidad_material: unidad,
      cantidad_material: cantidad,
      descripcion_direccion_material: UbicacionMaterial,
    };

    try {
      const response = await fetch(
        `${URL_BACKEND}/api/editar-material/${id_material}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el material");

      alert("Material actualizado correctamente");
      navigate("/perfil-comercial"); // Cambié history.push a navigate
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar el material");
    }
  };

  const handleCancel = () => {
    navigate(-1); // Redirige a la página anterior
  };

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);

  return (
    <div>
      <div>
        <NavBar />
        <div className="p-4 font-nunito">
          <h2 className="text-2xl font-bold">Editar Material</h2>
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-2 gap-4">
        <div className="lg:ml-20 ml-5">
          <form action="#" method="POST" className="space-y-4 lg:mt-10 mt-5">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-500 ml-2"
                >
                  Título
                </label>
                <input
                  required
                  placeholder="Título del material"
                  type="text"
                  id="title"
                  name="title"
                  className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-500 ml-2"
                >
                  Precio
                </label>
                <input
                  required
                  placeholder="Precio en Bs."
                  type="number"
                  id="price"
                  name="price"
                  className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md"
                  value={precio}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (value <= 20000) {
                      setPrecio(e.target.value);
                    } else {
                      setPrecio("");
                    }
                  }}
                  min="0"
                  max="20000"
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-500 ml-2"
                >
                  Categoría
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="1">Ladrillo</option>
                  <option value="2">Cemento</option>
                  <option value="3">Tablones</option>
                  <option value="4">Vigas</option>
                  <option value="5">Arena</option>
                  <option value="6">Mezclas</option>
                  <option value="7">Herramientas Manuales</option>
                  <option value="8">Madera</option>
                  <option value="9">Tejas</option>
                  <option value="10">Yeso</option>
                  <option value="11">Piedras</option>

                </select>
              </div>
              <div>
                <label
                  htmlFor="condition"
                  className="block text-sm font-medium text-gray-500 ml-2"
                >
                  Condición del Material
                </label>
                <select
                  id="condition"
                  name="condition"
                  className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md"
                  value={condicion}
                  onChange={(e) => setCondicion(e.target.value)}
                >
                  <option value="">Selecciona la condición</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                  <option value="remanufacturado">Remanufacturado</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Unidad</label>
                <select
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value)}
                  className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md"
                >
                  <option value="">Selecciona una unidad</option>
                  <option value="metroLineal">Metro lineal</option>
                  <option value="metroCuadrado">Metro Cuadrado</option>
                  <option value="metroCubico">Metro Cúbico</option>
                  <option value="unidad">Unidad</option>
                  <option value="kilogramo">Kilogramo</option>
                  <option value="paquete">Paquete</option>
                  <option value="litro">Litro</option>
                  <option value="docena">Docena</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="units"
                  className="block text-sm font-medium text-gray-500 ml-2"
                >
                  Cantidad disponible
                </label>
                <input
                  required
                  placeholder="Cantidad disponible:"
                  type="number"
                  id="unidad"
                  name="unidad"
                  className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-500 ml-2"
                >
                  Descripción
                </label>
                <textarea
                  required
                  placeholder="Descripción del material"
                  id="description"
                  name="description"
                  rows={4}
                  className="w-3/5 bg-gray-100 mt-1 p-2 border rounded-md"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-4 w-3/5">
              <label className="block text-sm font-medium text-gray-500 ml-2">
                Ubicación
              </label>
              <div className="flex mt-1">
                <input
                  type="text"
                  className="bg-gray-100 border text-sm rounded-md w-full p-2"
                  placeholder="Tu ubicación"
                  required
                  value={UbicacionMaterial}
                  onChange={(e) => setUbicacionMaterial(e.target.value)}
                />
                <div
                  onClick={() => setOpenMap(!openMap)}
                  className="ml-2 p-2 bg-gray-100 border rounded-md"
                >
                  <MdLocationOn className="text-xl text-black" />
                </div>
              </div>
              {openMap && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                  onClick={() => setOpenMap(false)}
                >
                  <div
                    className="bg-white p-6 rounded-lg w-full max-w-2xl h-[400px] lg:h-[600px] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mapa
                      onUbicacionSeleccionada={(lat: number, lng: number) => {
                        setCoordenadasSeleccionadas({ lat, lng });
                        setOpenMap(false);
                      }}
                      onDireccionObtenida={setUbicacionMaterial}
                      className="w-full h-full"
                    />
                    <div className="mt-4 flex justify-end">
                      <button
                        className="bg-red-600 text-white font-semibold rounded-lg px-4 py-2"
                        onClick={() => setOpenMap(false)}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="w-[80%]">
          <div className="flex flex-col items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Presiona para subir</span> O
                  arrastra y suelta
                </p>
                <p className="text-xs text-gray-500">PNG o JPG</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                multiple
                onChange={handleImageChange}
              />
            </label>
            <button
              onClick={handleUploadClick}
              className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Seleccionar imágenes
            </button>
          </div>
          <div className="grid grid-cols-3 mt-3">
            {images.map((image, index) => (
              <img
                src={image}
                key={index}
                className="w-full h-full object-cover"
              />
            ))}
          </div>
          {/* Modal de recorte y rotacion */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className="fixed inset-0 flex items-center justify-center bg-white rounded-lg shadow-lg"
          >
            <div className="p-4 max-w-md w-full">
              <h2 className="text-lg font-semibold mb-4">Recortar Imagen</h2>
              {image && (
                <div className="relative w-full h-96 mb-4">
                  <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation} // Añadir rotación al Cropper
                    aspect={1} // Mantiene el aspecto 1:1
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                  />
                </div>
              )}
              <div className="flex justify-between">
                <button
                  onClick={handleCrop}
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Recortar Imagen
                </button>
                <button
                  onClick={rotateImage}
                  className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                >
                  Rotar Imagen
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    imagesPerCrop.shift();
                    setImagesPerCrop([...imagesPerCrop]);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className="flex mt-3 mb-5 justify-end mr-[10%] space-y-4 md:space-y-0 md:flex-row md:space-x-4">
        <button
          type="button"
          onClick={handleSave}
          className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-6 py-3 shadow-md"
        >
          Guardar Cambios
        </button>
        <Link to="/perfil-comercial">
          <button
            type="button"
            onClick={handleCancel}
            className="text-white bg-gray-500 hover:bg-gray-600 font-medium rounded-lg text-sm px-6 py-3 shadow-md"
          >
            Cancelar
          </button>
        </Link>
        <button
          className="text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-6 py-3 shadow-md"
          onClick={() => {
            togglePopup();
          }}
        >
          Eliminar Publicación
        </button>
        {isPopupVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-60 z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
              <FormEliminacion
                onConfirm={() => {
                  togglePopup();
                }}
                onCancel={togglePopup}
              />
              <button
                onClick={togglePopup}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Editar;
