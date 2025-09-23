"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCategoriesQuery } from "@/store/slices/apiSlice";
import {
  setCategory,
  setPriceRange,
  setMinRating,
  clearFilters,
  selectFilters,
} from "@/store/slices/filtersSlice";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
  TagIcon,
  CurrencyDollarIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const TABS = [
  { id: "category", label: "Category", icon: TagIcon },
  { id: "price", label: "Price", icon: CurrencyDollarIcon },
  { id: "rating", label: "Rating", icon: StarIcon },
];

export default function FilterModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const currentFilters = useSelector(selectFilters);
  const { data: categories, isLoading } = useGetCategoriesQuery();

  const [activeTab, setActiveTab] = useState("category");
  const [pending, setPending] = useState({
    category: "all",
    priceRange: [0, 2000],
    minRating: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setPending({
        category: currentFilters.category,
        priceRange: [...currentFilters.priceRange],
        minRating: currentFilters.minRating,
      });
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    dispatch(setCategory(pending.category));
    dispatch(setPriceRange(pending.priceRange));
    dispatch(setMinRating(pending.minRating));
    onClose();
  };

  const handleCancel = () => {
    setPending({
      category: currentFilters.category,
      priceRange: [...currentFilters.priceRange],
      minRating: currentFilters.minRating,
    });
    onClose();
  };

  const getCount = () => {
    let count = 0;
    if (pending.category !== "all") count++;
    if (pending.priceRange > 0 || pending.priceRange < 2000) count++;
    if (pending.minRating > 0) count++;
    return count;
  };

  const hasChanges = () => {
    return (
      pending.category !== currentFilters.category ||
      pending.priceRange !== currentFilters.priceRange ||
      pending.priceRange !== currentFilters.priceRange ||
      pending.minRating !== currentFilters.minRating
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-25 z-5"
        // onClick={handleCancel}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:justify-end md:items-stretch md:p-0"
        onClick={handleCancel}
      >
        <div
          className="bg-white rounded-lg md:rounded-none md:rounded-l-lg shadow-xl w-full md:w-96 lg:w-[30rem] xl:w-[40rem] flex flex-col max-h-[80vh] sm:max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-semibold">Filters</h3>
              <p className="text-sm text-gray-500">{getCount()} active</p>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row h-[75%]">
            {/* Tabs */}
            <div className="flex md:flex-col border-b md:border-b-0 md:border-r bg-gray-50 md:bg-transparent">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 p-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-red-600 bg-red-50 border-b-2 md:border-b-0 md:border-r-2 border-red-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              {/* Category Tab */}
              {activeTab === "category" && (
                <div className="space-y-2 overflow-y-auto max-h-96 md:max-h-full">
                  <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      checked={pending.category === "all"}
                      onChange={() =>
                        setPending((prev) => ({ ...prev, category: "all" }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        pending.category === "all"
                          ? "border-red-600 bg-red-600"
                          : "border-gray-300"
                      }`}
                    >
                      {pending.category === "all" && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm">All Categories</span>
                  </label>

                  {isLoading
                    ? Array(6)
                        .fill()
                        .map((_, i) => (
                          <div
                            key={i}
                            className="h-8 bg-gray-200 rounded animate-pulse"
                          />
                        ))
                    : categories?.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="radio"
                            checked={pending.category === cat.slug}
                            onChange={() =>
                              setPending((prev) => ({
                                ...prev,
                                category: cat.slug,
                              }))
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                              pending.category === cat.slug
                                ? "border-red-600 bg-red-600"
                                : "border-gray-300"
                            }`}
                          >
                            {pending.category === cat.slug && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className="text-sm capitalize">{cat.name}</span>
                        </label>
                      ))}
                </div>
              )}

              {/* Price Tab */}
              {activeTab === "price" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Min
                      </label>
                      <input
                        type="number"
                        value={pending.priceRange}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setPending((prev) => ({
                            ...prev,
                            priceRange: [val, prev.priceRange],
                          }));
                        }}
                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Max
                      </label>
                      <input
                        type="number"
                        value={pending.priceRange}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 2000;
                          setPending((prev) => ({
                            ...prev,
                            priceRange: [prev.priceRange, val],
                          }));
                        }}
                        className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        placeholder="2000"
                      />
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-red-600">
                      ${pending.priceRange} - ${pending.priceRange}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      ["Under $50", [0, 50]],
                      ["$50-$100", [50, 100]],
                      ["$100-$200", [100, 200]],
                      ["Over $200", [200, 2000]],
                    ].map(([label, range]) => (
                      <button
                        key={label}
                        onClick={() =>
                          setPending((prev) => ({ ...prev, priceRange: range }))
                        }
                        className={`p-2 border rounded text-xs ${
                          pending.priceRange === range &&
                          pending.priceRange === range
                            ? "border-red-600 bg-red-50 text-red-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating Tab */}
              {activeTab === "rating" && (
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      setPending((prev) => ({ ...prev, minRating: 0 }))
                    }
                    className={`w-full flex items-center p-2 rounded text-left ${
                      pending.minRating === 0
                        ? "bg-red-50 border border-red-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        pending.minRating === 0
                          ? "border-red-600 bg-red-600"
                          : "border-gray-300"
                      }`}
                    >
                      {pending.minRating === 0 && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-sm">Any Rating</span>
                  </button>

                  {[4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setPending((prev) => ({ ...prev, minRating: rating }))
                      }
                      className={`w-full flex items-center p-2 rounded text-left ${
                        pending.minRating === rating
                          ? "bg-red-50 border border-red-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                          pending.minRating === rating
                            ? "border-red-600 bg-red-600"
                            : "border-gray-300"
                        }`}
                      >
                        {pending.minRating === rating && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array(5)
                            .fill()
                            .map((_, i) => (
                              <StarIconSolid
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                        </div>
                        <span className="text-sm">{rating}+ Stars</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPending({
                    category: "all",
                    priceRange: [0, 2000],
                    minRating: 0,
                  })
                }
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 font-medium"
              >
                Apply ({getCount()})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
