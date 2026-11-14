"use client";

type DeleteProductFormProps = {
  productId: string;
  action: (formData: FormData) => Promise<void>;
};

export function DeleteProductForm({
  productId,
  action,
}: DeleteProductFormProps) {
  return (
    <form action={action}>
      <input type="hidden" name="productId" value={productId} />
      <button
        type="submit"
        className="text-xs text-red-500 hover:underline"
        onClick={(event) => {
          if (
            !confirm(
              "Delete this product? If it has ever been ordered it will be archived instead, so order history is kept.",
            )
          )
            event.preventDefault();
        }}
      >
        Delete
      </button>
    </form>
  );
}
