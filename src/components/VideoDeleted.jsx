import { PiSealWarning } from '../icons';

export default function VideoDeleted() {
  return (
    <div className="border-b border-gray-600 pb-4">
      <div className="pointer-events-none flex w-full items-start gap-x-4 rounded-lg bg-black/30 opacity-50">
        <div className="relative h-25 w-36 shrink-0 cursor-pointer p-1 md:h-36 md:w-61">
          <div className="h-full w-full rounded-lg bg-black/40 backdrop-blur-sm">
            <div className="absolute top-1/2 left-1/2 -translate-1/2 leading-0">
              <p>
                <PiSealWarning className="mx-auto text-xl md:text-2xl" />
              </p>
              <span className="hidden text-[11px] sm:text-xs md:inline">
                Video deleted
              </span>
            </div>
          </div>
        </div>

        <div className="flex max-w-155 grow cursor-pointer gap-x-2 py-2">
          <div className="relative grow text-sm">
            <div className="h-6 w-3/4 rounded bg-gray-500 md:h-8"></div>
            <div className="mt-2 flex space-x-2">
              <div className="h-4 w-24 rounded bg-gray-500"></div>
              <div className="h-3 w-32 rounded bg-gray-500"></div>
            </div>
            <div className="mt-2 hidden md:block">
              <div className="mb-1 h-4 w-full rounded bg-gray-500"></div>
              <div className="mb-1 h-4 w-full rounded bg-gray-500"></div>
              <div className="h-4 w-3/4 rounded bg-gray-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
