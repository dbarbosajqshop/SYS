import { SupervisorCreatePassword } from "@/components/SupervisorCreatePassword";
import { formatDate, imgString } from "@/helpers";
import { useProfile } from "@/hooks/useProfile";
import { ArrowBack } from "@/icons/ArrowBack";
import { EyeSlash } from "@/icons/EyeSlash";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { changePassword, putUserPhoto } from "@/services/users";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Caption } from "@/ui/typography/Caption";
import { Heading } from "@/ui/typography/Heading";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemPhoto, setItemPhoto] = useState<File | null>(null);

  const { profile, refetchProfile } = useProfile();

  const navigate = useNavigate();

  const isSupervisor = profile?.Roles?.some(
    (role) => role.name === "supervisor"
  );
  console.log(profile);

  useEffect(() => {
    if (confirmPassword === "") return setError("");
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
    } else {
      setError("");
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    const putPhoto = async () => {
      if (!itemPhoto) return;
      setLoading(true);
      const response = await putUserPhoto(profile?._id, itemPhoto);
      if (response.status === 200) {
        toast.success("Foto alterada com sucesso");
        setLoading(false);
        return refetchProfile();
      }
      setLoading(false);
      return toast.error(response.data.message || response.data.error, {
        theme: "colored",
      });
    };

    putPhoto();
  }, [itemPhoto]);

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const response = await changePassword(profile?._id, {
        actualPassword: currentPassword,
        password: newPassword,
      });
      if (response.status === 200)
        return toast.success("Senha alterada com sucesso");
      return toast.error(response.data.message);
    } catch (error: unknown) {
      console.error(error);
      return toast.error("Erro ao alterar senha");
    } finally {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size / 1024 / 1024 > 10)
      return toast.error("O arquivo deve ter no máximo 10MB");

    if (file) {
      setItemPhoto(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-sm px-sm sm:px-md bg-neutral-100 h-full">
      <div className="flex flex-col gap-2">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowBack />
          <Caption color="text-neutral-500" variant="large">
            Voltar
          </Caption>
        </div>
        <Heading variant="medium">Seu perfil</Heading>
      </div>
      <div className="flex-col gap-4 sm:flex-row flex sm:items-center justify-between bg-neutral-0 p-sm inset-sm rounded-nano border border-neutral-200">
        <div className="flex items-center gap-4">
          <div
            className="cursor-pointer"
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <img
              src={imgString(profile?.dataImage?.data)}
              className="h-16 w-16 sm:h-28 sm:w-28"
              alt="profile picture"
            />
            <input
              id="fileInput"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div>
            <Subtitle variant="large-semibold">{profile?.name}</Subtitle>
            <Paragraph color="text-neutral-500">{profile?.email}</Paragraph>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-center justify-between sm:items-end gap-2">
          <Subtitle variant="large-semibold">
            {profile?.Roles?.map((role) => role.name).join(", ")}
          </Subtitle>
          <Paragraph color="text-neutral-500">
            Criado: {formatDate(profile?.createdAt)}
          </Paragraph>
        </div>
      </div>
      {!loading ? (
        <div className="bg-neutral-0 p-sm inset-sm rounded-nano border border-neutral-200">
          {isSupervisor && !profile?.supervisorPassword && (
            <SupervisorCreatePassword
              refetchProfile={refetchProfile}
              profile={profile}
            />
          )}

          <Subtitle variant="large-semibold">Alterar senha</Subtitle>
          <Input
            className="w-full sm:w-1/2 bg-neutral-100"
            label="Senha atual"
            placeholder="Insira sua senha atual"
            type="password"
            data={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={<EyeSlash />}
            iconPosition="right"
          />
          <div className="flex flex-col sm:flex-row items-center sm:gap-4">
            <Input
              wide
              className="w-full bg-neutral-100"
              label="Nova senha"
              placeholder="Insira sua nova senha"
              type="password"
              data={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<EyeSlash />}
              iconPosition="right"
              error={error}
            />
            <Input
              wide
              className="w-full bg-neutral-100"
              label="Confirmar nova senha"
              placeholder="Confirme sua nova senha"
              type="password"
              data={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<EyeSlash />}
              iconPosition="right"
              error={error}
            />
          </div>
          <div className="border-t flex items-center justify-end gap-2">
            <Button variant="naked">Cancelar</Button>
            <Button
              onClick={handleChangePassword}
              disabled={error != "" || !confirmPassword || !currentPassword}
            >
              Salvar senha
            </Button>
          </div>
        </div>
      ) : (
        <SpinningLogo />
      )}
    </div>
  );
}
