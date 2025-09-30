import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import type { ReactNode } from 'react'



interface IProps {
    isOpen: boolean
    closed: () => void
    children: ReactNode
    title?: string;
    description?: string;
}
const Modal = ({isOpen, closed,title,children, description} : IProps) => {
    return (<>
        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={closed}>
        <DialogBackdrop className="fixed inset-0 backdrop-blur-sm" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                transition
                className="w-full max-w-md rounded-xl bg-white backdrop-blur-sm p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                >
                <DialogTitle as="h3" className=" text-xl font-medium text-gray-600">
                {title}
                </DialogTitle>
                <p className="text-sm text-black/50 ">
                    {description}
                </p>
                <div className="mt-4">
                {children}
                </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
  </>)
}

export default Modal