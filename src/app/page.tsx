import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <span className="mb-4 inline-block rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-400 uppercase tracking-widest">
          Your lifting journal
        </span>
        <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-zinc-50 leading-tight">
          Track every rep.
          <br />
          Build every habit.
        </h1>
        <p className="mt-6 max-w-lg text-lg text-zinc-400 leading-relaxed">
          Lifting Diary is a simple, focused app for logging your workouts,
          tracking your exercises, and watching your strength grow over time.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Button asChild size="lg">
            <Link href="/sign-up">Get started for free</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-800 px-6 py-24">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-xl">
              🏋️
            </div>
            <h3 className="font-semibold text-zinc-100">Log workouts</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Record every session with a name, date, exercises, sets, reps,
              and weight — all in one place.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-xl">
              📈
            </div>
            <h3 className="font-semibold text-zinc-100">Track progress</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              See exactly how your lifts improve week after week. Every set is
              saved so nothing gets lost.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-xl">
              🎯
            </div>
            <h3 className="font-semibold text-zinc-100">Stay consistent</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              A clean, distraction-free interface built around the habit of
              showing up and putting in the work.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-800 px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-zinc-50 tracking-tight">
          Ready to start lifting smarter?
        </h2>
        <p className="mt-4 text-zinc-400">
          Free to use. No credit card required.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/sign-up">Create your account</Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-600">
        © {new Date().getFullYear()} Lifting Diary. All rights reserved.
      </footer>
    </div>
  );
}
