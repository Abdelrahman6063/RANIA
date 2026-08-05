import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoginGate } from "@/components/LoginGate";

export const Route = createFileRoute("/private/")({
  head: () => ({
    meta: [
      { title: "الصندوق الخاص" },
      { name: "description", content: "مساحة صغيرة محجوزة لكلام أكثر خصوصية." },
      { property: "og:title", content: "الصندوق الخاص" },
      { property: "og:description", content: "مساحة صغيرة محجوزة لكلام أكثر خصوصية." },
    ],
  }),
  component: PrivateLogin,
});

function PrivateLogin() {
  const navigate = useNavigate();
  return (
    <LoginGate
      scriptTitle="Private"
      subtitle="ONLY FOR YOU"
      expectedUser="6063"
      expectedPass="47839836063"
      themeFace="linear-gradient(155deg, oklch(0.5 0.17 355), oklch(0.26 0.1 320))"
      onUnlock={() => {
        sessionStorage.setItem("rania-private", "1");
        navigate({ to: "/private/messages" });
      }}
    />
  );
}