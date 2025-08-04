import { Close } from "@/icons/Close";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Button } from "@/ui/Button";
import { Paragraph } from "@/ui/typography/Paragraph";
import ImgCrop from "antd-img-crop";
import { Upload } from "antd";
import { toast } from "react-toastify";
import React from "react";

type ImageUploadModalProps = {
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  itemPhoto: File | null;
  setItemPhoto: (photo: File | null) => void; 
  onSave: () => void;
  imageUrl?: string | null;
};

export const ImageUploadModal = ({
  open,
  setOpen,
  itemPhoto,
  setItemPhoto,
  onSave,
  imageUrl,
}: ImageUploadModalProps) => {
  const handleImageUpload = (file: File | undefined) => {
    if (file && file.size / 1024 / 1024 > 10) {
      return toast.error("O arquivo deve ter no máximo 10MB");
    }
    if (file) {
      setItemPhoto(file);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setItemPhoto(null); 
  };

  return (
    <div
      className={`fixed p-10 left-0 top-0 z-50 flex h-screen w-screen items-center justify-center
      bg-black bg-opacity-50 ${open ? "" : "hidden"} `}
    >
      <div className="w-auto sm:w-[500px] overflow-y-auto max-h-full pb-3 bg-neutral-0 rounded-sm border border-neutral-200">
        <div className="flex justify-between h-[77px] p-sm border-b border-neutral-200">
          <Subtitle variant="large-semibold">Alterar Imagem do Item</Subtitle>
          <Close onClick={handleClose} />
        </div>
        <div className="p-sm flex flex-col items-center gap-4">
          <div className="sm:min-w-44 sm:w-44 sm:h-44 min-w-24 w-24 h-24 border border-neutral-200 flex-shrink-0">
            {itemPhoto ? (
              <img
                src={URL.createObjectURL(itemPhoto)}
                alt="Nova imagem do produto"
                className="w-full h-full object-cover"
              />
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Imagem atual do produto"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`flex items-center justify-center w-full h-full bg-neutral-200`}
              >
                <img
                  src={"/no-image.jpeg"}
                  alt="Sem imagem"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          <Paragraph color="text-neutral-500" className="text-center">
            Faça upload de uma nova imagem para o produto em PNG ou JPEG com no máximo 10MB.
          </Paragraph>

          <ImgCrop
            onModalOk={(e) => {
              handleImageUpload(e as File);
            }}
          >
            <Upload
              beforeUpload={() => {}}
              customRequest={() => {}}
              id="fileInput"
              accept="image/png, image/jpeg"
              fileList={[]}
            >
              <Button>Fazer upload</Button>
            </Upload>
          </ImgCrop>
        </div>
        <div className="flex justify-end gap-2 px-sm">
          <Button variant="naked" color="default" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" onClick={onSave} disabled={!itemPhoto}>
            Salvar Imagem
          </Button>
        </div>
      </div>
    </div>
  );
};