export interface BoxDialogProps{
  visible: boolean
  onHide: () => void
  onSave: (data: { boxCount: number; productCounts: string[] }) => void
}