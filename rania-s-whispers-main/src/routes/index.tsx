import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LoginGate } from "@/components/LoginGate";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RANIA — My Everything" },
      { name: "description", content: "رسائل مكتوبة من القلب… تُفتح بمفتاح واحد." },
      { property: "og:title", content: "RANIA — My Everything" },
      { property: "og:description", content: "رسائل مكتوبة من القلب… تُفتح بمفتاح واحد." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  return (
    <LoginGate
      scriptTitle="RANIA"
      subtitle="MY EVERYTHING"
      expectedUser="RANIA"
      expectedPass="5/9/2005"
      onUnlock={() => {
        sessionStorage.setItem("rania-unlocked", "1");
        navigate({ to: "/messages" });
      }}
    />
  );
}
