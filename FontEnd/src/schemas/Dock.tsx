import { IPostDock } from "@/types/docks";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";

type DockProps = {
  dockData: IPostDock;
  errors: { [key: string]: string };
  setDockData: (
    DockData:
      | DockProps["dockData"]
      | ((prevData: DockProps["dockData"]) => DockProps["dockData"])
  ) => void;
};

export const Dock = ({ dockData, setDockData, errors }: DockProps) => {
  const handleChange = (e: string) => {
    let inputValue = e;
    inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, "");
    inputValue = inputValue.slice(0, 8);

    setDockData((prevData) => ({ ...prevData, code: inputValue }));
  };

  const getError = (field: string) => {
    return errors[field] || "";
  };

  return (
    <div>
      <Subtitle variant="large-semibold">Informações da Doca</Subtitle>
      <Input
        wide
        name="code"
        data={dockData?.code}
        label="Código"
        placeholder="Insira o código da doca."
        onChange={(e) => handleChange(e.target.value)}
        error={getError("code")}
      />
    </div>
  );
};
