'use client'
import { ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

export function Option({initialValue, title, options, sendBack} : {initialValue: {value: string} | null, title: string, options: {value: string}[], sendBack: (value: { value: string })=> void}) {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  const [show, setShow] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState<"down" | "up">("down");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number>(0);

  useEffect(() => {
    if (!buttonRef.current) return;

    // Function to update width
    const updateWidth = () => {
      if (buttonRef.current) {
        setButtonWidth(buttonRef.current.offsetWidth);
      }
    };

    // Initial width
    updateWidth();

    // Observe size changes
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(buttonRef.current);

    // Cleanup
    return () => resizeObserver.disconnect();
  }, []);


  useEffect(() => {
    if (rect && show) {
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Example: 300px is your dropdown height (or measure via ref)
      if (spaceBelow < ((options.length * 32) + 40) && spaceAbove > spaceBelow) {
        setPosition("up");
      } else {
        setPosition("down");
      }
    }
  }, [rect, show]);

  useEffect(() => {
    if (!show) return;

    function update() {
      if (buttonRef.current) {
        setRect(buttonRef.current.getBoundingClientRect());
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node) // don’t close when clicking the button again
      ) {
        setShow(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShow(false);
      }
    }

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [show]);

  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);

  const handleChange = (value: {value: string}) => {
    setSelectedValue(value);
    sendBack(value);
  };

  return (
    <div className='w-full'>
      <div className="relative h-fit">
        <button 
          className={`w-full px-3 text-left text-black rounded-md shadow-sm cursor-default text-sm py-2 h-fit min-h-10 ${show ? `outline-2 outline-amber-600` : `outline outline-black`}`}
          onClick={(e)=> {e.preventDefault(); setShow(prev => !prev)}}
          ref={buttonRef}
        >
          {title.trim() !== "" &&
            <label 
              className={`flex pointer-events-none items-center p-0 px-1 transition-all duration-300 ease-out absolute top-1/2 h-[18px] w-fit -translate-y-1/2 overflow-hidden text-nowrap left-2 bg-white ${selectedValue ? `absolute top-[-18px] text-xs translate-y-1/2 transition-all duration-300 ease-out pointer-events-none text-amber-600`: `text-black`}`}
            >
              {title}
            </label>
          }
          
          <span className="text-sm pr-4">{selectedValue ? selectedValue.value : ' '}</span>
          
        </button>
          <ChevronDown
            className={clsx(`pointer-events-none absolute right-3 top-1/2 h-[18px] -translate-y-1/2 text-black w-4`,
              'transition-transform duration-300', {'rotate-180': show}
            )}
          />
          {rect && typeof document !== "undefined" &&
            createPortal(
              <AnimatePresence>
                {show && (
                  <motion.div
                    ref={dropdownRef}
                    key="dropdown-portal"
                    initial={{ opacity: 0, y: position === "down" ? 100 : -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: position === "down" ? 100 : -100 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                      position: "fixed",
                      left: rect.left,
                      top: position === "down" ? rect.bottom + 6 : rect.bottom - ((options.length * 32) + 65),
                      width: buttonWidth,
                      zIndex: 35,
                    }}
                  >
                    <div className="shadow-2xl w-full py-1 px-2 mt-1 overflow-auto text-sm border border-slate-200 bg-slate-50 rounded-md max-h-70 focus:outline-none">
                      {options.map((option) => (
                        <button
                          key={option.value}
                          className={`group flex w-full items-center text-left gap-2 rounded-lg py-1.5 px-3 select-none text-black
                            disabled:opacity-70 disabled:hover:cursor-not-allowed ${selectedValue?.value === option.value ?
                              `disabled:bg-inherit disabled:text-[#2c2c2c] hover:disabled:text-[#2c2c2c] bg-amber-600 text-white`
                              : "hover:bg-[#f1f1f1] disabled:hover:bg-inherit"}
                          `}
                          onClick={(e)=> {e.preventDefault(); e.stopPropagation(); handleChange(option); setShow(false)}}
                        >
                          <Check className={`size-4 transition-opacity ${selectedValue?.value === option?.value ? "opacity-100" : "opacity-0"}`} />
                          <div> {option.value} </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>,
              document.body
            )
          }
      </div>
    </div>
  );
}