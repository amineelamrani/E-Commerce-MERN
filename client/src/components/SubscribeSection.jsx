import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SubscribeSection() {
  return (
    <div className="w-full flex flex-col items-center gap-2 text-center py-5">
      <h1 className="text-xl font-bold">Subscribe now & get 20% off</h1>
      <p className="text-md text-slate-500">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
      <div className="flex w-full max-w-sm items-center">
        <Input
          type="email"
          placeholder="Enter your email"
          className="rounded-none"
        />
        <Button type="submit" className="rounded-none">
          Subscribe
        </Button>
      </div>
    </div>
  );
}
