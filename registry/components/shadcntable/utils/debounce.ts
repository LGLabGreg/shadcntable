/**
 * Debounce function
 * Example usage:
 * import { debounce } from '@/lib/utils/debounce'
 *
 * const debouncedOnChange = useMemo(
 *   () => debounce((val: string) => onChange(val || undefined), debounceMs),
 *   [onChange, debounceMs]
 * )
 */
export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number = 300,
): ((...args: Parameters<F>) => void) & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout>

  const debounced = (...args: Parameters<F>): void => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout)
  }

  return debounced
}
