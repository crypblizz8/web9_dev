import Image from 'next/image';

export default function LoadingLogo() {
  return (
    <div className='flex items-center justify-center w-full h-full bg-[#1e1e1e]'>
      <div className='relative w-32 h-32 animate-pulse-scale'>
        <Image
          src='/vib3_logo.png'
          alt='Vib3 Logo'
          layout='fill'
          objectFit='contain'
          priority
        />
      </div>
      <style jsx global>{`
        @keyframes pulseScale {
          0% {
            transform: scale(0.75);
          }
          50% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.25);
          }
        }
        .animate-pulse-scale {
          animation: pulseScale 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
