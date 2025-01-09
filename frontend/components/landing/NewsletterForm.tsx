import * as React from 'react';
export interface NewsletterFormData {
    email: string;
  }

export const NewsletterForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col px-8 py-10 mt-9 max-w-full rounded-xl border border-solid bg-slate-900 border-slate-800 w-[393px] max-md:px-5">
      <h2 className="text-2xl font-bold tracking-tighter leading-none text-neutral-100">
        Subscribe to our newsletter
      </h2>
      <div className="flex flex-col mt-5 w-full text-base max-w-[333px]">
        <label htmlFor="email" className="sr-only">Enter your email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="gap-2.5 px-7 py-2.5 w-full border border-solid bg-slate-900 border-slate-800 rounded-[50px] text-slate-600 max-md:px-5"
          aria-label="Enter your email"
        />
        <button
          type="submit"
          className="gap-2.5 self-stretch px-20 py-4 mt-4 w-full font-medium leading-none text-white whitespace-nowrap bg-violet-600 rounded-[36px] max-md:px-5"
        >
          Subscribe
        </button>
      </div>
    </form>
  );
};