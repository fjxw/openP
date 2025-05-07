using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OpenP.Entities;

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.ToTable("CartItems");
        builder.HasKey(ci => ci.CartItemId);

        builder.Property(ci => ci.CartId)
            .IsRequired();
        builder.Property(ci => ci.ProductId)
            .IsRequired();
        builder.Property(ci => ci.Quantity)
            .IsRequired();
   
        builder.HasOne(ci => ci.Cart)
            .WithMany(c => c.CartItems)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade);
        
    }
}