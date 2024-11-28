'use client'

import { FaHardHat, FaTools, FaHome } from 'react-icons/fa'
import { Card, Button } from 'flowbite-react'

interface UnderConstructionProps {
  title?: string
  message?: string
  showHomeButton?: boolean
  onHomeClick?: () => void
}

export default function UnderConstruction({
  title = "Página en Construcción",
  message = "Estamos trabajando para mejorar esta sección. Vuelve pronto para ver los cambios.",
  showHomeButton = true,
  onHomeClick
}: UnderConstructionProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md">
        <div className="flex justify-center items-center space-x-4 mb-6">
          <FaTools className="h-10 w-10 text-yellow-500 animate-bounce" />
          <FaHardHat className="h-10 w-10 text-yellow-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-center mb-3">
          {title}
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
          {message}
        </p>
        
        {showHomeButton && (
          <div className="flex justify-center">
            <Button
              onClick={onHomeClick}
              outline
              gradientDuoTone="cyanToBlue"
            >
              <FaHome className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}

