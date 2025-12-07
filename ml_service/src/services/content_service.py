"""
Content Generation Service
Simulates generative AI outputs for marketing copy, blog posts, and multi-channel campaigns.
"""

from __future__ import annotations

import random
from datetime import datetime
from textwrap import dedent
from typing import Any, Dict, List

import structlog

logger = structlog.get_logger(__name__)


class ContentService:
    """Generative content service returning rich marketing collateral."""

    def __init__(self):
        self.model_version = "gpt-marketing-suite-v0.9"
        logger.info("Initialized ContentService", model_version=self.model_version)

    async def generate_marketing_content(
        self,
        topic: str,
        keywords: List[str],
        tone: str,
        length: str,
        include_examples: bool,
        target_audience: str,
    ) -> Dict[str, Any]:
        logger.info(
            "Generating marketing content",
            topic=topic,
            tone=tone,
            length=length,
            target=target_audience,
        )

        outline = self._create_outline(topic, target_audience)
        content = self._create_long_form_content(topic, outline, tone, include_examples)
        channel_variations = self._create_channel_variations(topic, tone, target_audience)
        seo_score = 82 + random.randint(-5, 7)

        response = {
            "title": self._compose_title(topic, tone),
            "outline": outline,
            "content": content,
            "meta_title": self._compose_meta_title(topic),
            "meta_description": self._compose_meta_description(topic, target_audience),
            "suggested_keywords": self._suggest_keywords(topic, keywords),
            "seo_score": min(max(seo_score, 65), 98),
            "estimated_word_count": 650 if length == "short" else 1200 if length == "long" else 900,
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "tone": tone,
            "length": length,
            "target_audience": target_audience,
            "channel_variations": channel_variations,
            "image_prompt": self._image_prompt(topic, tone, target_audience),
            "model_version": self.model_version,
        }
        return response

    # ------------------------------------------------------------------
    # Helper methods
    # ------------------------------------------------------------------
    @staticmethod
    def _compose_title(topic: str, tone: str) -> str:
        suffix = {
            "friendly": "that Customers Love",
            "professional": "for Scaled Commerce Teams",
            "playful": "with a WOW Factor",
            "technical": "Engineered for Revenue Teams",
        }.get(tone, "that Converts")
        return f"{topic.title()} {suffix}"

    @staticmethod
    def _compose_meta_title(topic: str) -> str:
        return f"{topic.title()} | Easy11 Commerce Intelligence"

    @staticmethod
    def _compose_meta_description(topic: str, audience: str) -> str:
        return (
            f"Discover how {topic.lower()} unlocks growth for {audience} on Easy11. "
            "Get AI-powered recommendations, campaign ideas, and ready-to-launch copy."
        )

    @staticmethod
    def _create_outline(topic: str, audience: str) -> List[str]:
        return [
            f"Why {topic.title()} matters for {audience}",
            "Audience pain points & opportunity matrix",
            "Signature Easy11 differentiators",
            "Campaign ideas & activation plan",
            "Success metrics and next steps",
        ]

    @staticmethod
    def _create_long_form_content(topic: str, outline: List[str], tone: str, include_examples: bool) -> str:
        tone_label = tone.title()
        sections = []
        for item in outline:
            paragraph = dedent(
                f"""
                ## {item}

                {tone_label} insight: {topic.title()} accelerates adoption by aligning merchandising,
                retention, and campaign automation. Easy11 surfaces the exact signals that show when
                to launch, what to feature, and how to personalize offers.
                """
            ).strip()
            if include_examples:
                paragraph += dedent(
                    """

                    **Example activation:** Launch a segmented email journey with dynamic product
                    blocks, then retarget high-intent shoppers via push notifications that highlight
                    inventory freshness and loyalty rewards.
                    """
                )
            sections.append(paragraph)
        conclusion = dedent(
            """
            ## Bring it to life

            Ship this playbook via the Easy11 Command Center: align the brief, sync the campaign, and
            launch with full attribution tracking. Activate referrals, loyalty boosts, and post-purchase
            flows to keep the momentum compounding.
            """
        ).strip()
        sections.append(conclusion)
        return "\n\n".join(sections)

    @staticmethod
    def _suggest_keywords(topic: str, keywords: List[str]) -> List[str]:
        base = [topic.lower(), f"{topic.lower()} strategy", "commerce ai", "easy11 campaigns"]
        return list(dict.fromkeys(base + keywords))

    @staticmethod
    def _create_channel_variations(topic: str, tone: str, audience: str) -> List[Dict[str, Any]]:
        base_cta = "Launch with Easy11" if audience == "vendors" else "Explore Easy11"
        return [
            {
                "channel": "email",
                "headline": f"{topic.title()} — Ready in One Click",
                "subheadline": "Your weekly growth play is pre-written and pre-personalized.",
                "body": (
                    "Hi there,\n\nYour shoppers are signalling fresh intent. "
                    f"Use this {tone} sequence to spotlight trending products, "
                    "tight inventory, and loyalty boosts.\n\nPreview the journey today."
                ),
                "call_to_action": base_cta,
            },
            {
                "channel": "sms",
                "headline": f"{topic[:35].title()} → Live in minutes",
                "body": (
                    f"{topic.title()} is live. Tap to drop AI-personalized offers before your "
                    "competition does. Easy11 keeps attribution clean."
                ),
                "call_to_action": base_cta,
            },
            {
                "channel": "social",
                "headline": f"{topic.title()} Playbook",
                "body": (
                    "Merchants using Easy11 see +18% lift after launching this play. "
                    "Personalize, launch, measure—without heavy lifting."
                ),
                "call_to_action": "#Easy11Growth",
            },
        ]

    @staticmethod
    def _image_prompt(topic: str, tone: str, audience: str) -> str:
        return (
            f"{tone} illustration showcasing {topic.lower()} for {audience}, "
            "with futuristic ecommerce dashboards, vibrant gradients, and clear call-to-action overlays."
        )


content_service = ContentService()


