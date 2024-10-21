import Material, { type MaterialProp } from "./Material";

interface ListarMaterialesProps {
    materiales: MaterialProp[];
}

const ListarMateriales = ({ materiales }: ListarMaterialesProps) => {
    return (
        <div className="flex gap-2 md:gap-9 md:px-4 py-5 overflow-x-auto hide-scrollbar">
            {materiales.map((material) => (
                <Material material={material} />
            ))}
        </div>
    );
};

export default ListarMateriales;
