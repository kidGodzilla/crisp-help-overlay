<script setup>
import { Search } from "lucide-vue-next";
import { ref, computed, watch, onMounted } from "vue";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import { Input } from "@/components/ui/input";

const urlParams = new URLSearchParams(window.location.search);
const BaseUrl = urlParams.get("baseURL") || "help.crisp.chat/en";
const height = ref(urlParams.get("height") || 400);

onMounted(() => {
  // Focus input
  document.querySelector('.crisp-search-input').focus();
})

// Todo: Hacky but what's the alternative?
clearInterval(window.focusInterval);
window.focusInterval = setInterval(() => {
  if (document.body.getBoundingClientRect().width) {
    document.querySelector('.crisp-search-input').focus();
  } else {
    // Reset
    searchString.value = "";
    resultsArray.value = [];
  }
}, 500);

const isFetched = ref(false);
const isLoading = ref(false);
const resultsArray = ref([]);
const searchString = ref("");

const fetchArticles = async (searchTerm) => {
  if (!searchTerm) return resultsArray.value = [];

  var url = `/search?term=${ encodeURIComponent(searchTerm) }&baseURL=${ encodeURIComponent(BaseUrl) }`;

  const response = await fetch(url);
  const html = await response.text();
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, "text/html");

  const fullBaseUrl = `https://${ BaseUrl }`;

  doc.querySelectorAll("a").forEach((link, i) => {
    let url = new URL(link.href, fullBaseUrl);
    let href = link.getAttribute("href");
    if (href) {
      const url = new URL(href, fullBaseUrl);
      link.target = "_blank";
      link.href = url.href;
    }

    link.removeAttribute("onmouseenter");
    link.removeAttribute("onmouseleave");
    link.removeAttribute("data-active");
    link.removeAttribute("class");
    const title =
      link
        .querySelector(".csh-include-search-result-title")
        ?.textContent.trim() || "";
    const description =
      link
        .querySelector(".csh-include-search-result-description")
        ?.textContent.trim() || "";
    resultsArray.value.push({ title, description, href: link.href });
  });
  isLoading.value = false;
  isFetched.value = true;
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const delayedSearch = debounce(async (value) => {
  try {
    await fetchArticles(value);
  } catch (error) {
    console.error("Error in search:", error);
  }
}, 1000);

const handleSearch = (event) => {
    isLoading.value = true;
    isFetched.value = false;
  delayedSearch(searchString.value);
};

function esc() {
  window.parent.postMessage('escape', '*');
}
</script>

<template>
  <!-- command component -->
  <div :style="`height: ${ height }px`" @keydown.esc="esc()">
    <Command>
      <div class="flex items-center border-b px-3" cmdk-input-wrapper>
        <Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <Input
          type="text"
          placeholder="Search our Help Center..."
          v-model="searchString"
          class="crisp-search-input flex h-11 w-full rounded-md bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:outline-0 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          @input="handleSearch"
        />
      </div>
      <CommandList>
        <CommandEmpty v-if="isLoading"><span>Loading</span> </CommandEmpty>
        <CommandEmpty v-if="isFetched && !resultsArray.length"><span>No results found.</span> </CommandEmpty>
        <CommandGroup v-if="resultsArray.length" heading="Results">
          <CommandItem
            v-for="(result, index) in resultsArray"
            :key="index"
            :value="index"
          >
            <a :href="result.href" target="_blank">
              <div>{{ result.title }}</div>
              <div>{{ result.description }}</div>
            </a>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Search Documentation" v-if="!resultsArray.length">
          <CommandItem value="Home">Search for helpdesk articles & support topics</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </div>
</template>

<style>
div[data-radix-vue-combobox-item] a div:first-of-type {
  font-weight: 700;
  color: #191919;
}
</style>