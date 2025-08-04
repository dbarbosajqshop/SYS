import { ArrowBack } from "@/icons/ArrowBack";
import { IconButton } from "@/ui/IconButton";
import { Caption } from "@/ui/typography/Caption";
import { Paragraph } from "@/ui/typography/Paragraph";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Input } from "@/ui/Input";
import { Search } from "@/icons/Search";
import { Button } from "@/ui/Button";
import { Add } from "@/icons/Add";
import { IGetStock } from "@/types/stock";
import { useStocks } from "@/hooks/useStocks";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { Street } from "@/schemas/Street";
import { IGetStreet, IPutStreet } from "@/types/street";
import { FormModal } from "@/ui/FormModal";
import { useStreets } from "@/hooks/useStreets";
import { useBuilds } from "@/hooks/useBuilds";
import { useFloors } from "@/hooks/useFloors";
import { StockTable } from "@/components/StockTable";
import { DeleteConfirmationModal } from "@/ui/DeleteConfirmationModal";
import { IPutBuild } from "@/types/build";
import { Build } from "@/schemas/Build";
import { IPutFloor } from "@/types/floor";
import { Floor } from "@/schemas/Floor";
import { useProfile } from "@/hooks/useProfile";

export default function StockDetail() {
  const [search, setSearch] = useState("");
  const [stockData, setStockData] = useState<IGetStock>();
  const [streetData, setStreetData] = useState<IPutStreet>({} as IPutStreet);
  const [streetModalMode, setStreetModalMode] = useState<"create" | "edit">("create");
  const [openStreetModal, setOpenStreetModal] = useState(false);
  const [openDeleteStreetModal, setOpenDeleteStreetModal] = useState(false);
  const [buildData, setBuildData] = useState<IPutBuild>({} as IPutBuild);
  const [buildModalMode, setBuildModalMode] = useState<"create" | "edit">("create");
  const [openBuildModal, setOpenBuildModal] = useState(false);
  const [openDeleteBuildModal, setOpenDeleteBuildModal] = useState(false);
  const [floorData, setFloorData] = useState<IPutFloor>({} as IPutFloor);
  const [floorModalMode, setFloorModalMode] = useState<"create" | "edit">("create");
  const [openFloorModal, setOpenFloorModal] = useState(false);
  const [openDeleteFloorModal, setOpenDeleteFloorModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { fetchStock, loading } = useStocks();
  const { addStreet, loading: loadingStreet, updateStreet, removeStreet } = useStreets();
  const { addBuild, loading: loadingBuild, updateBuild, removeBuild } = useBuilds();
  const { addFloor, loading: loadingFloor, updateFloor, removeFloor } = useFloors();

  const fetchStockData = async () => {
    const stock = await fetchStock(location.pathname.split("/")[3]);
    setStockData(stock);
  };

  const { authorize } = useProfile();

  useEffect(() => {
    fetchStockData();
  }, [location.pathname]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSubmitStreet = async () => {
    if (streetModalMode === "create") await addStreet(stockData?._id || "", streetData);
    else await updateStreet(streetData._id || "", streetData);

    setStreetData({
      _id: "",
      name: "",
      description: "",
      code: "",
    });
    await fetchStockData();
    setOpenStreetModal(false);
  };

  const handleOpenCreateModal = () => {
    setStreetModalMode("create");
    setStreetData({
      name: "",
      description: "",
      code: "",
    });
    setOpenStreetModal(true);
  };

  const handleOpenEditModal = (street: IGetStreet) => {
    setStreetModalMode("edit");
    setStreetData(street);
    setOpenStreetModal(true);
  };

  const handleOpenDeleteStreetModal = (street: IGetStreet) => {
    setStreetData(street);
    setOpenDeleteStreetModal(true);
  };

  const handleRemoveStreet = async () => {
    await removeStreet(streetData._id || "");
    await fetchStockData();
    setOpenDeleteStreetModal(false);
  };

  const handleSubmitBuild = async () => {
    if (buildModalMode === "create") await addBuild(streetData._id || "", buildData);
    else await updateBuild(buildData._id || "", buildData);

    setBuildData({
      _id: "",
      name: "",
      description: "",
      code: "",
    });
    await fetchStockData();
    setOpenBuildModal(false);
  };

  const handleOpenCreateBuildModal = (street: IGetStreet) => {
    setBuildModalMode("create");
    setStreetData(street);
    setBuildData({
      name: "",
      description: "",
      code: "",
    });
    setOpenBuildModal(true);
  };

  const handleOpenEditBuildModal = (build: IPutBuild) => {
    setBuildModalMode("edit");
    setBuildData(build);
    setOpenBuildModal(true);
  };

  const handleOpenDeleteBuildModal = (build: IPutBuild) => {
    setBuildData(build);
    setOpenDeleteBuildModal(true);
  };

  const handleRemoveBuild = async () => {
    await removeBuild(buildData._id || "");
    await fetchStockData();
    setOpenDeleteBuildModal(false);
  };

  const handleSubmitFloor = async () => {
    if (floorModalMode === "create") await addFloor(buildData._id || "", floorData);
    else await updateFloor(floorData._id || "", floorData);

    setFloorData({
      _id: "",
      name: "",
      description: "",
      code: "",
      orderLocal: "online",
    });
    await fetchStockData();
    setOpenFloorModal(false);
  };

  const handleOpenCreateFloorModal = (build: IPutBuild) => {
    setFloorModalMode("create");
    setBuildData(build);
    setFloorData({
      name: "",
      description: "",
      code: "",
      orderLocal: "online",
    });
    setOpenFloorModal(true);
  };

  const handleOpenEditFloorModal = (floor: IPutFloor) => {
    setFloorModalMode("edit");
    setFloorData(floor);
    setOpenFloorModal(true);
  };

  const handleOpenDeleteFloorModal = (floor: IPutFloor) => {
    setFloorData(floor);
    setOpenDeleteFloorModal(true);
  };

  const handleRemoveFloor = async () => {
    await removeFloor(floorData._id || "");
    await fetchStockData();
    setOpenDeleteFloorModal(false);
  };

  if (loading) return <SpinningLogo />;

  return (
    <div className="flex flex-col gap-6 bg-neutral-0 p-sm border border-neutral-200 rounded-nano">
      {!loadingStreet && (
        <>
          <FormModal
            entity="rua"
            mode={streetModalMode === "create" ? "Criar" : "Editar"}
            open={openStreetModal}
            setOpen={setOpenStreetModal}
            onSubmit={handleSubmitStreet}
          >
            <Street streetData={streetData} setStreetData={setStreetData} />
          </FormModal>
          <DeleteConfirmationModal
            title="Você tem certeza que deseja excluir essa rua?"
            description="Ao excluir essa rua não será possível recuperá-lo e nem os itens anexados a ele"
            open={openDeleteStreetModal}
            setOpen={setOpenDeleteStreetModal}
            onConfirm={handleRemoveStreet}
          />
        </>
      )}
      {!loadingBuild && (
        <>
          <FormModal
            entity="prédio"
            mode={buildModalMode === "create" ? "Criar" : "Editar"}
            open={openBuildModal}
            setOpen={setOpenBuildModal}
            onSubmit={handleSubmitBuild}
          >
            <Build buildData={buildData} setBuildData={setBuildData} />
          </FormModal>
          <DeleteConfirmationModal
            title="Você tem certeza que deseja excluir esse prédio?"
            description="Ao excluir esse prédio não será possível recuperá-lo e nem os itens anexados a ele"
            open={openDeleteBuildModal}
            setOpen={setOpenDeleteBuildModal}
            onConfirm={handleRemoveBuild}
          />
        </>
      )}
      {!loadingFloor && (
        <>
          <FormModal
            entity="andar"
            mode={floorModalMode === "create" ? "Criar" : "Editar"}
            open={openFloorModal}
            setOpen={setOpenFloorModal}
            onSubmit={handleSubmitFloor}
          >
            <Floor floorData={floorData} setFloorData={setFloorData} />
          </FormModal>
          <DeleteConfirmationModal
            title="Você tem certeza que deseja excluir esse andar?"
            description="Ao excluir esse andar não será possível recuperá-lo e nem os itens anexados a ele"
            open={openDeleteFloorModal}
            setOpen={setOpenDeleteFloorModal}
            onConfirm={handleRemoveFloor}
          />
        </>
      )}

      <div className="flex items-center">
        <IconButton
          size="large"
          iconColor="#71717A"
          onClick={() => navigate("/register/stocks")}
        >
          <ArrowBack />
        </IconButton>
        <Caption variant="large" color="text-neutral-500">
          {`Estoque / ${stockData?.name}`}
        </Caption>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
        <div className="w-full">
          <Paragraph variant="large" color="text-neutral-500">
            Estoque:
          </Paragraph>
          <Subtitle variant="large">{stockData?.name}</Subtitle>
        </div>
        <Input
          data={search}
          onChange={handleSearch}
          icon={<Search />}
          iconPosition="left"
          className="bg-neutral-0 w-full"
        />
        {authorize("w_street") && (
          <Button
            variant="naked"
            color="default"
            className="border"
            onClick={handleOpenCreateModal}
          >
            <Add /> <Caption variant="large">Criar rua</Caption>
          </Button>
        )}
      </div>

      {loadingStreet || loadingBuild || loadingFloor ? (
        <SpinningLogo />
      ) : (
        stockData && (
          <StockTable
            editStreet={handleOpenEditModal}
            removeStreet={handleOpenDeleteStreetModal}
            addBuild={handleOpenCreateBuildModal}
            editBuild={handleOpenEditBuildModal}
            removeBuild={handleOpenDeleteBuildModal}
            addFloor={handleOpenCreateFloorModal}
            editFloor={handleOpenEditFloorModal}
            removeFloor={handleOpenDeleteFloorModal}
            stock={stockData}
          />
        )
      )}
    </div>
  );
}
