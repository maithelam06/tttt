package com.example.bewebsslock.dto.request;
import jakarta.validation.constraints.*;
import java.util.*;
public class OrderRequest {
	@NotNull
	public Long customerId;
	@NotEmpty
	public List<Item> items;
	public String note;
	public static class Item {
		@NotNull
		public Long productId;
		@Positive
		public int quantity;
	}
}
