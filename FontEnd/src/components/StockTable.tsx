import React, { useState } from "react";
import { Add } from "@/icons/Add";
import { DeleteOutline } from "@/icons/DeleteOutline";
import { Edit } from "@/icons/Edit";
import { KeyboardArrowRight } from "@/icons/KeyboardArrowRight";
import { KeyboardArrowDown } from "@/icons/KeyboardArrowDown";
import { IGetBuild } from "@/types/build";
import { IGetStock } from "@/types/stock";
import { IGetStreet } from "@/types/street";
import { IGetFloor } from "@/types/floor";
import { IconButton } from "@/ui/IconButton";
import { Caption } from "@/ui/typography/Caption";
import { useProfile } from "@/hooks/useProfile";

type Props = {
  stock: IGetStock;
  editStreet: (street: IGetStreet) => void;
  removeStreet: (street: IGetStreet) => void;
  addBuild: (streetId: IGetStreet) => void;
  editBuild: (build: IGetBuild) => void;
  removeBuild: (build: IGetBuild) => void;
  addFloor: (buildId: IGetBuild) => void;
  editFloor: (floor: IGetFloor) => void;
  removeFloor: (floor: IGetFloor) => void;
};

export const StockTable = ({
  stock,
  editStreet,
  removeStreet,
  addBuild,
  editBuild,
  removeBuild,
  addFloor,
  editFloor,
  removeFloor,
}: Props) => {
  const [expandedStreets, setExpandedStreets] = useState<number[]>([]);
  const [expandedBuilds, setExpandedBuilds] = useState<number[]>([]);
  const { authorize } = useProfile();

  const toggleStreet = (index: number) => {
    setExpandedStreets((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleBuild = (index: number) => {
    setExpandedBuilds((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-max overflow-x-auto">
      <table className="rounded-nano w-full table-fixed">
        <thead className="bg-neutral-50 border border-neutral-200 h-11 px-sm">
          <tr>
            <th align="left" className="px-3 w-20">
              <Caption variant="large-semibold" color="text-neutral-500">
                Tipo
              </Caption>
            </th>
            <th align="left" className="px-3 w-80">
              <Caption variant="large-semibold" color="text-neutral-500">
                Nome
              </Caption>
            </th>
            <th align="left" className="px-3 w-96">
              <Caption variant="large-semibold" color="text-neutral-500">
                Descrição
              </Caption>
            </th>
            <th align="left" className="px-3 w-80">
              <Caption variant="large-semibold" color="text-neutral-500">
                Código
              </Caption>
            </th>
            <th align="left" className="px-3 w-30">
              <Caption variant="large-semibold" color="text-neutral-500">
                Produtos em estoque
              </Caption>
            </th>
            <th align="left" className="px-3 w-24"></th>
          </tr>
        </thead>
        <tbody>
          {stock.Streets.map((street, index) => (
            <React.Fragment key={index}>
              <tr className="h-[52px] border border-neutral-200 text-nowrap">
                <td className="px-3 w-20">
                  <div className="flex items-center gap-2">
                    {authorize("w_build") && (
                      <Add
                        onClick={() => addBuild(street)}
                        className="cursor-pointer"
                      />
                    )}
                    <Caption variant="large">Rua</Caption>
                  </div>
                </td>
                <td className="px-3 w-80">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleStreet(index)}
                  >
                    {expandedStreets.includes(index) ? (
                      <KeyboardArrowDown />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                    <Caption variant="large">{street.name}</Caption>
                  </div>
                </td>
                <td className="px-3 w-96">
                  <Caption variant="large">{street.description}</Caption>
                </td>
                <td className="px-3 w-80">
                  <Caption variant="large">{street.code}</Caption>
                </td>
                <td className="px-3 w-30">
                  <Caption variant="large">0</Caption>
                </td>
                <td className="flex items-center justify-end px-3 w-24">
                  {authorize("u_street") && (
                    <IconButton
                      onClick={() => editStreet(street)}
                      iconColor="#1567E2"
                      size="large"
                    >
                      <Edit />
                    </IconButton>
                  )}
                  {authorize("d_street") && (
                    <IconButton
                      onClick={() => removeStreet(street)}
                      iconColor="#DC2626"
                      size="large"
                    >
                      <DeleteOutline />
                    </IconButton>
                  )}
                </td>
              </tr>

              {expandedStreets.includes(index) && street.Builds.length > 0 && (
                <tr>
                  <td colSpan={6}>
                    <table className="w-full table-fixed">
                      <tbody>
                        {street.Builds.map((build, buildIndex) => (
                          <React.Fragment key={buildIndex}>
                            <tr className="h-[52px] bg-neutral-100 border border-neutral-200 text-nowrap">
                              <td className="px-3 w-24">
                                <div className="flex items-center gap-2">
                                  {authorize("w_floor") && (
                                    <Add
                                      onClick={() => addFloor(build)}
                                      className="cursor-pointer"
                                    />
                                  )}
                                  <Caption variant="large">Prédio</Caption>
                                </div>
                              </td>
                              <td className="w-80">
                                <div
                                  className="flex items-center cursor-pointer"
                                  onClick={() => toggleBuild(buildIndex)}
                                >
                                  {expandedBuilds.includes(buildIndex) ? (
                                    <KeyboardArrowDown />
                                  ) : (
                                    <KeyboardArrowRight />
                                  )}
                                  <Caption variant="large">
                                    {build.name}
                                  </Caption>
                                </div>
                              </td>
                              <td className="w-96">
                                <Caption variant="large">
                                  {build.description}
                                </Caption>
                              </td>
                              <td className="w-80">
                                <Caption variant="large">{build.code}</Caption>
                              </td>
                              <td className="w-72">
                                <Caption variant="large">0</Caption>
                              </td>
                              <td className="flex items-center justify-end px-3 w-24">
                                {authorize("u_build") && (
                                  <IconButton
                                    onClick={() => editBuild(build)}
                                    iconColor="#1567E2"
                                    size="large"
                                  >
                                    <Edit />
                                  </IconButton>
                                )}
                                {authorize("d_build") && (
                                  <IconButton
                                    onClick={() => removeBuild(build)}
                                    iconColor="#DC2626"
                                    size="large"
                                  >
                                    <DeleteOutline />
                                  </IconButton>
                                )}
                              </td>
                            </tr>

                            {expandedBuilds.includes(buildIndex) &&
                              build.Floors.length > 0 && (
                                <tr>
                                  <td colSpan={6}>
                                    <table className="w-full table-fixed">
                                      <tbody>
                                        {build.Floors.map(
                                          (floor, floorIndex) => (
                                            <tr
                                              key={floorIndex}
                                              className="h-[52px] bg-neutral-200 border border-neutral-200 text-nowrap"
                                            >
                                              <td className="px-3 w-24">
                                                <div className="flex items-center gap-2">
                                                  <Caption variant="large">
                                                    Andar
                                                  </Caption>
                                                </div>
                                              </td>
                                              <td className="w-80">
                                                <Caption variant="large">
                                                  {floor.name}
                                                </Caption>
                                              </td>
                                              <td className="w-96">
                                                <Caption variant="large">
                                                  {floor.description}
                                                </Caption>
                                              </td>
                                              <td className="w-80">
                                                <Caption variant="large">
                                                  {floor.code}
                                                </Caption>
                                              </td>
                                              <td className="w-72">
                                                <Caption variant="large">
                                                  0
                                                </Caption>
                                              </td>
                                              <td className="flex items-center justify-end px-3 w-24">
                                                {authorize("u_floor") && (
                                                  <IconButton
                                                    onClick={() =>
                                                      editFloor(floor)
                                                    }
                                                    iconColor="#1567E2"
                                                    size="large"
                                                  >
                                                    <Edit />
                                                  </IconButton>
                                                )}
                                                {authorize("d_floor") && (
                                                  <IconButton
                                                    onClick={() =>
                                                      removeFloor(floor)
                                                    }
                                                    iconColor="#DC2626"
                                                    size="large"
                                                  >
                                                    <DeleteOutline />
                                                  </IconButton>
                                                )}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
