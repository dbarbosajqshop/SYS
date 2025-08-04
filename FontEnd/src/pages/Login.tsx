import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "@/services/login";
import { EyeSlash } from "@/icons/EyeSlash";
import { Input } from "@/ui/Input";
import { Button } from "@/ui/Button";
import { Heading } from "@/ui/typography/Heading";
import { SpinningLogo } from "@/icons/SpinningLogo";

const logo = import.meta.env.VITE_LOGO_URL;

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLoginData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = loginData;
    try {
      const response = await login(email, password);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);

        return navigate("/sales");
      }
    } catch (error) {
      if (error instanceof Error) {
        return toast.error(error.message, { theme: "colored" });
      }
      toast.error("An unknown error occurred", { theme: "colored" });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center">
      <form onSubmit={handleLogin} className="my-auto self-center">
        <img src={logo} alt="logo" className="mb-6" />
        <Heading variant="large" color="text-neutral-400">
          Bem-Vindo,
        </Heading>
        <Heading variant="large">faça o seu login</Heading>
        <Input
          data={loginData.email}
          onChange={handleLoginData}
          name="email"
          label="Email"
          placeholder="Insira seu email"
          wide
        />
        <Input
          data={loginData.password}
          onChange={handleLoginData}
          name="password"
          label="Senha"
          icon={<EyeSlash />}
          type="password"
          iconPosition="right"
          placeholder="Insira sua senha"
          wide
        />
        {loading ? (
          <SpinningLogo />
        ) : (
          <Button
            disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)}
            type="submit"
            wide
          >
            Entrar
          </Button>
        )}
      </form>
    </div>
  );
}
